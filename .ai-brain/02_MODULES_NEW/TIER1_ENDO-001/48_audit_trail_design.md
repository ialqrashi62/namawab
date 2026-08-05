# ENDO-001 — Audit Trail Design

Per safety rail 10: hash-chained, 7+ years.

```sql
CREATE TABLE audit_events_endo_001 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  user_id UUID,
  action VARCHAR(64),
  resource_type VARCHAR(64),
  resource_id VARCHAR(64),
  before JSONB, after JSONB,
  ip INET,
  ts TIMESTAMPTZ DEFAULT now(),
  prev_hash VARCHAR(64),
  hash VARCHAR(64) NOT NULL
);
ALTER TABLE audit_events_endo_001 ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events_endo_001 FORCE ROW LEVEL SECURITY;
```

Hash chain: `hash = sha256(prev_hash + ts + user_id + resource + before + after)`

---

*Owner: CQO+DSL — 2026-08-01*
