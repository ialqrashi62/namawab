# 48 — Audit Trail Design (CARD-001)

> Owner: CQO + DSL · Snippet: snippet:audit-hash · Tier 1

## Goals

- Complete, tamper-evident, hash-chained audit log
- All clinical, operational, financial, security actions logged
- 7+ year retention
- Per-tenant isolation
- Queryable for forensics + compliance

## Schema

```sql
-- audit_log table (assumed existing)
CREATE TABLE audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  actor_id        UUID,
  actor_role      TEXT,
  action          TEXT NOT NULL,             -- e.g. CREATE_CARDIO_CATH
  resource_type   TEXT NOT NULL,             -- e.g. cardio_cath
  resource_id     UUID,
  request_id      UUID,
  ip              INET,
  user_agent      TEXT,
  payload         JSONB,                      -- changed fields (no PHI)
  before          JSONB,                      -- previous state (no PHI)
  after           JSONB,                      -- new state (no PHI)
  cds_rules       JSONB,
  red_flag        BOOLEAN DEFAULT FALSE,
  severity        TEXT,                       -- info | warn | critical
  prev_hash       TEXT NOT NULL,
  this_hash       TEXT NOT NULL,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_tenant_action ON audit_log(tenant_id, action, occurred_at DESC);
CREATE INDEX idx_audit_tenant_resource ON audit_log(tenant_id, resource_type, resource_id, occurred_at DESC);
CREATE INDEX idx_audit_actor ON audit_log(tenant_id, actor_id, occurred_at DESC);
CREATE INDEX idx_audit_redflag ON audit_log(tenant_id, red_flag, occurred_at DESC) WHERE red_flag = TRUE;
CREATE INDEX idx_audit_critical ON audit_log(tenant_id, severity, occurred_at DESC) WHERE severity = 'critical';
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log FORCE ROW LEVEL SECURITY;
CREATE POLICY audit_log_tenant ON audit_log
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
```

## Hash chain

```python
# pseudocode
def append_audit(actor_id, action, resource, payload, before, after, severity='info', red_flag=False):
    tenant_id = current_tenant()
    prev = db.query("SELECT this_hash FROM audit_log WHERE tenant_id = %s ORDER BY occurred_at DESC LIMIT 1", tenant_id)
    prev_hash = prev.this_hash if prev else 'GENESIS'
    content = json.dumps({
      'tenant_id': tenant_id,
      'actor_id': actor_id,
      'action': action,
      'resource_type': resource['type'],
      'resource_id': resource['id'],
      'payload': payload,
      'before': before,
      'after': after,
      'red_flag': red_flag,
      'severity': severity,
      'occurred_at': now(),
      'prev_hash': prev_hash,
    }, sort_keys=True)
    this_hash = sha256(content)
    db.insert('audit_log', {
      'tenant_id': tenant_id,
      'actor_id': actor_id,
      'action': action,
      ...
      'prev_hash': prev_hash,
      'this_hash': this_hash,
    })
    return this_hash
```

## Cardinal actions to log (cardiology)

| Action | Severity | PHI redacted? | Notes |
|--------|----------|---------------|-------|
| CREATE_CARDIO_ENCOUNTER | info | yes | store id, type, no chief_complaint |
| UPDATE_CARDIO_ENCOUNTER | info | yes | diff only |
| SIGN_CARDIO_ENCOUNTER | info | yes | by |
| CREATE_CARDIO_ECG | info | no (file_hash) | file_hash ok, no waveform |
| SIGN_CARDIO_ECG | info | no | doctor sign |
| CREATE_CARDIO_CATH | critical | yes | id + bundle + amount |
| SIGN_CARDIO_CATH | critical | yes | sign event |
| CREATE_CARDIO_DEVICE | critical | yes | id + device_type + amount |
| EXPLANT_CARDIO_DEVICE | critical | yes | reason + by |
| ACTIVATE_RED_FLAG | critical | yes | rf_id + actor + patient_hash |
| CLOSE_RED_FLAG | warn | yes | outcome |
| CO_PILOT_QUERY | info | yes (redacted) | trace_id + cost + tokens |
| CO_PILOT_RED_FLAG_DETECTED | critical | yes | rf_id |
| CREATE_NPHIES_CLAIM | critical | yes | claim_id + amount + bundle |
| SUBMIT_NPHIES_CLAIM | critical | yes | response_code + amount |
| DENY_NPHIES_CLAIM | warn | yes | reason |
| ROLE_GRANT | critical | yes | user + role + by |
| ROLE_REVOKE | critical | yes | user + role + by |
| CROSS_TENANT_BLOCK | critical | yes | attempt details |
| CROSS_SPECIALTY_BLOCK | warn | yes | attempt details |
| MONEY_OVERRIDE | critical | yes | amount + by + reason |
| BACKUP_CREATED | info | no | filename + size |
| BACKUP_VERIFIED | info | no | filename + size |
| MIGRATION_RUN | warn | no | migration_name + by |
| MIGRATION_REVERT | critical | no | migration_name + by |
| SECRET_ROTATE | critical | no | secret_name + by |
| POLICY_DROP | critical | no | policy_name + by |

## PHI redaction

Audit log NEVER contains:
- Patient name
- Patient national_id
- Patient phone / email
- Full chief complaint text (use chief_complaint_category)
- Full HPI / exam / plan (use encounter.id ref, not text)
- ECG waveform
- DICOM image
- File content

Audit log MAY contain (PHI-redacted):
- patient_id (UUID, RLS-scoped, lookup requires auth)
- patient_hash (one-way hash for correlation)
- encounter.id
- chief_complaint_category (e.g. "chest_pain", "palpitations")
- diagnosis_primary (ICD-10 code)
- procedure_type (e.g. "PCI")
- amount (no patient identity needed)
- timestamps

## Severity

- **info:** normal operations
- **warn:** soft anomalies (rejected claim, near-SLA)
- **critical:** money, red_flag, role change, breach, RLS policy drop

## Retention

- Hot (DB): 7 years
- Cold (S3 immutable): 7+ years
- Offsite backup: per backup policy

## Query examples

```sql
-- All red_flag activations in last 24h
SELECT * FROM audit_log
WHERE tenant_id = current_setting('app.tenant_id')::uuid
  AND red_flag = TRUE
  AND occurred_at > NOW() - INTERVAL '24 hours'
ORDER BY occurred_at DESC;

-- All money overrides by admin X
SELECT * FROM audit_log
WHERE tenant_id = current_setting('app.tenant_id')::uuid
  AND action = 'MONEY_OVERRIDE'
  AND actor_id = '<admin-uuid>'
ORDER BY occurred_at DESC;

-- Verify chain integrity
WITH RECURSIVE chain AS (
  SELECT id, prev_hash, this_hash, 1 AS depth
  FROM audit_log WHERE tenant_id = '<uuid>' ORDER BY occurred_at ASC LIMIT 1
  UNION ALL
  SELECT a.id, a.prev_hash, a.this_hash, c.depth + 1
  FROM audit_log a JOIN chain c ON a.prev_hash = c.this_hash
  WHERE a.tenant_id = '<uuid>'
)
SELECT MAX(depth) AS chain_length, COUNT(*) FILTER (WHERE this_hash IS NULL) AS null_hashes
FROM chain;
-- If chain_length != (SELECT COUNT(*) FROM audit_log WHERE tenant_id = '<uuid>'), chain is broken.

-- Detect tampering
SELECT a.id, a.prev_hash, a.this_hash, prev.this_hash AS expected_prev
FROM audit_log a
LEFT JOIN audit_log prev ON prev.this_hash = a.prev_hash
WHERE a.tenant_id = '<uuid>'
  AND prev.id IS NULL
  AND a.prev_hash != 'GENESIS';
-- If any row, chain is broken.
```

## On incident

- Snapshot full audit log
- Verify chain integrity
- Export for forensic analysis
- Maintain chain of custody (write-once + signed)

## Compliance

- PDPL: audit = evidence of compliance
- CBAHI: audit = required for credentialing + privileging
- JCI: audit = evidence of QPS
- NPHIES: audit = evidence of money trail
- SFDA: audit = evidence of device traceability
- HIPAA-aligned: audit = evidence of access control (164.312(b))
