<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# SNIPPETS — Shared Paragraphs for POC Generation

> **Audience:** 7-Expert Panel + ORC generating 35-file modules for CARD-002, NEPH-002, ER-002.
> **Rule:** Reuse these snippets via `$ref: SNIPPETS.md#<id>` rather than rewriting.
> **Source:** Synthesized from AGENTS.md §2.2, MASTER_PROMPT_v3.md, COMPLIANCE_CORE.yaml, DESIGN_SYSTEM.yaml.

---

## SNIP-01: 13 Safety Rails (AGENTS.md §2.2 — NON-NEGOTIABLE)

> **Rule:** Every module MUST reference this list. Any violation is a blocking finding, not a style issue.

| # | Rail | Implementation |
|---|---|---|
| 1 | No hardcoded secrets | `.env.example` placeholders (`__CHANGE_ME__`) only |
| 2 | No PHI in commits/fixtures/sandbox | Sandbox-only dummy data; loopback-only |
| 3 | No force-push to main/integration/audit | Linear history only; merges via PR |
| 4 | No DELETE/DROP on production without backup | `restore_db.sh` style requires recent dump |
| 5 | Tenant isolation ON | `requireTenantScope` on every protected route; RLS on every table |
| 6 | Money routes idempotent + opt-in + fail-open | `idempotencyGuard` exactly as GATE7 |
| 7 | PHI at rest encrypted | `crypto_envelope.js` (DPAPI KEK) for blobs; radiology in `phi_vault/` |
| 8 | CSP report-only by default | `CSP_ENFORCE=true` is a separate approved deploy |
| 9 | Money/VAT server-side | `parseMoney` + `finance_engine.vatFromInclusive` only |
| 10 | Audit log hash-chained, 7+ years | `audit_middleware.js` inert by default; enable is a gate decision |
| 11 | Fail-closed on missing tenant | `getPatientActiveMeds` etc. throw on missing `tenantId` |
| 12 | No print of secrets/tokens/PHI in logs | `console.log(req.body, headers, DB rows)` is a finding |
| 13 | Golden Access Rule | Owner/Admin absolute; Doctors/Staff strict specialty-based access |

**Status:** Honored across all 3 POC modules.

---

## SNIP-02: RLS / Tenant Isolation Pattern (PostgreSQL)

```sql
-- Per AGENTS.md §2.2 #5: every new table gets this pattern.
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;
ALTER TABLE {table_name} FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS {table_name}_tenant_isolation ON {table_name};
CREATE POLICY {table_name}_tenant_isolation ON {table_name}
  USING (tenant_id = current_setting('app.tenant_id')::UUID);

-- Add tenant_id NOT NULL to every table
ALTER TABLE {table_name}
  ADD COLUMN tenant_id UUID NOT NULL REFERENCES tenants(id);

-- Required audit columns
ALTER TABLE {table_name}
  ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN created_by_user_id BIGINT,
  ADD COLUMN updated_by_user_id BIGINT,
  ADD COLUMN soft_deleted_at TIMESTAMPTZ;  -- soft delete only

-- Index for tenant-scoped queries
CREATE INDEX idx_{table_name}_tenant ON {table_name}(tenant_id) WHERE soft_deleted_at IS NULL;
```

**Reference:** `namaweb/db_postgres.js` existing 150 RLS-forced tables; target after POC: 189 (150 + 39 new).

---

## SNIP-03: PHI Vault / crypto_envelope (DPAPI KEK)

> For blobs, scanned documents, DICOM files, and free-text PHI fields.

```javascript
const { encryptBlob, decryptBlob } = require('./crypto_envelope');

// Encrypt before write
const enc = encryptBlob(phiValue, {
  kekId: process.env.PHI_KEK_ID || 'kek-v1',
  aad: { tenantId, patientId, tableName, columnName }
});
await db.query(
  'INSERT INTO clinical_notes (id, tenant_id, patient_id, note_encrypted) VALUES ($1, $2, $3, $4)',
  [id, tenantId, patientId, enc]
);

// Decrypt on read (audit the access)
const row = await db.query('SELECT note_encrypted FROM clinical_notes WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
const note = decryptBlob(row.note_encrypted, { aad: { tenantId, patientId, tableName: 'clinical_notes', columnName: 'note_encrypted' } });
logAudit({ action: 'phi.read', userId, patientId, tableName: 'clinical_notes', columnName: 'note_encrypted' });
```

**Storage locations:**
- Small PHI columns: `bytea` in the table (envelope-encrypted)
- Large blobs (DICOM, scanned consent): `phi_vault/` outside webroot, path stored in DB
- Webroot never serves `phi_vault/` directly

---

## SNIP-04: Stitch 3-Column Station Layout (Premium RTL)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Top bar: Patient Header (sticky) — encrypted MRN, name, age, allergies   │
│ Live status: timers, KPI, red flags                                        │
├────────────┬────────────────────────────────────────────────┬──────────────┤
│ LEFT       │                CENTER                          │   RIGHT      │
│ Sidebar    │  (Workflow Stepper + Patient Context)           │   Sidebar    │
│            │                                                  │              │
│ Patient    │  ┌──────────────────────────────────────────┐   │  Vitals      │
│ Summary    │  │ Step 1 of 5: Triage / Admission          │   │  Lab         │
│ ─────      │  │ Step 2 of 5: Assessment                  │   │  Imaging     │
│ Identity   │  │ Step 3 of 5: Plan                        │   │  Meds        │
│ Allergies  │  │ Step 4 of 5: Intervention                │   │  Red Flags   │
│ PMH        │  │ Step 5 of 5: Disposition                 │   │              │
│ Meds       │  ├──────────────────────────────────────────┤   │              │
│ Labs       │  │ Active Step Content (form, viewer, etc.) │   │              │
│ Imaging    │  │ [← Prev] [Save Draft] [Next →]           │   │              │
│            │  └──────────────────────────────────────────┘   │              │
│ Score Calc │                                                  │              │
│ Risk Strat │  AI Insight (LangChain + RAG citation)           │              │
│            │  "Clinical note... — ACC/AHA 2024 §3.2"         │              │
│ [History]  │                                                  │              │
│            │                                                  │              │
└────────────┴────────────────────────────────────────────────┴──────────────┘
```

**Tokens:** Primary `#0066CC`, danger `#DC3545`, critical_value `#DC3545`, abnormal_high `#FF6B6B`, abnormal_low `#4D96FF`.
**i18n:** AR/EN bilingual, RTL-first.
**a11y:** WCAG 2.2 AA, keyboard nav, ARIA live regions for alerts.

**Specialized variants:**
- **CARD-002 Cath Lab:** Center = procedure timeline + DICOM viewer + hemodynamics; Right = ACT + anticoagulation + door-to-balloon timer.
- **NEPH-002 Transplant:** Center = donor-recipient matching + waitlist position; Right = trough levels + DSA + biopsy results.
- **ER-002 Trauma:** Center = ATLS A/B/C/D/E stepper + MTP status; Right = GCS trend + lactate + consultant responses.

---

## SNIP-05: Golden Access Rule (RBAC + Specialty Scope)

```javascript
// Per AGENTS.md §2.2 #13
function authorize(req, res, next) {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: 'unauthenticated' });

  // Owner/Admin: absolute access (no specialty gate)
  if (['owner', 'superadmin', 'admin'].includes(user.role)) {
    return next();
  }

  // Doctor/Staff: specialty-based access ONLY
  const resourceSpecialty = req.route.specialty;  // e.g. 'cardiology', 'nephrology', 'trauma'
  const userSpecialties = user.specialties || [];
  if (!userSpecialties.includes(resourceSpecialty)) {
    logAudit({ action: 'rbac.denied', userId: user.id, resourceSpecialty, userSpecialties });
    return res.status(403).json({ error: 'specialty_access_denied' });
  }

  // Explicit cross-specialty permission (rare, audit-logged)
  if (req.headers['x-cross-specialty-permission']) {
    logAudit({ action: 'rbac.cross_specialty.used', userId: user.id, resourceSpecialty, permission: req.headers['x-cross-specialty-permission'] });
  }

  next();
}
```

**Specialty mapping for POC:**
- CARD-002: `specialty = 'cardiology'` (sub: 'interventional_cardiology', 'electrophysiology', 'heart_failure')
- NEPH-002: `specialty = 'nephrology'` (sub: 'transplant_nephrology')
- ER-002: `specialty = 'trauma_surgery'` or `'emergency_medicine'`

---

## SNIP-06: Money/VAT Server-Side Only

```javascript
// Per AGENTS.md §2.2 #9
const { parseMoney, formatMoney } = require('./finance_engine');

// ❌ NEVER trust client totals
// const total = req.body.total;  // WRONG

// ✅ Always recompute server-side
const lineItems = req.body.line_items;  // [{ sku, qty, unit_price_cents }]
const subtotal_cents = lineItems.reduce((sum, li) => sum + (li.qty * parseMoney(li.unit_price_cents)), 0);
const vat_cents = finance_engine.vatFromInclusive(subtotal_cents, 0.15);  // 15% KSA VAT
const total_cents = subtotal_cents + vat_cents;
const discount_cents = req.body.discount_code
  ? await applyDiscount(req.body.discount_code, subtotal_cents, tenantId)
  : 0;
const final_total_cents = subtotal_cents + vat_cents - discount_cents;
```

**For NPHIES claims:** `final_total_cents` goes into the FHIR Claim response. Never the client-side value.

---

## SNIP-07: Idempotency Guard (GATE7 — money/claim routes only)

```javascript
const { idempotencyGuard } = require('./idempotency');

// Apply ONLY to money/claim routes, not to clinical reads
router.post('/api/cath-lab/procedures',
  requireAuth,
  requireTenantScope,
  requireRole('cardiology'),
  validateBody(RS.cathLab.cathProcedure),
  idempotencyGuard,  // ← GATE7 — opt-in + fail-open
  async (req, res) => {
    // ... handle cath procedure creation
  }
);
```

**Behavior:** Same `Idempotency-Key` header within 24h → returns cached response. Missing key → generates UUID. Server down → fail-open (log + proceed). Duplicate billing = violation.

---

## SNIP-08: Hash-Chained Audit Trail

```javascript
const { auditMiddleware } = require('./audit_middleware');
app.use('/api/cath-lab', auditMiddleware);  // inert by default

// Per-tenant enable
process.env.AUDIT_ENABLED_TENANTS = 'tenant-uuid-1,tenant-uuid-2';

// Every state-changing action emits:
// {
//   id, tenant_id, user_id, action, resource_type, resource_id,
//   input_hash (SHA-256 of request body),
//   output_hash (SHA-256 of response body),
//   prev_hash (previous audit entry's hash — hash chain),
//   client_ip, user_agent, created_at
// }
```

**Retention:** 7 years general; 10 years for imaging; pediatric until 25 OR 10y (whichever longer); lifetime for blood transfusion.

---

## SNIP-09: Safety Gate Pattern (GATE 2 catalog)

> Every workflow that touches patient safety or money has explicit gates.

| Gate | Trigger | Action |
|---|---|---|
| **Safety Gate** | "سلامة = نعم" في catalog | Feature-flag per tenant + observe-only period + signed clinical checklist |
| **Approval Gate** | Maker-checker required (e.g. controlled drugs, OR booking) | Two-role RBAC; cannot self-approve |
| **Audit Gate** | PHI/financial action | Hash-chained audit entry automatically |
| **High-Alert Drug Gate** | Anticoagulant, opioid, insulin, chemo, K+ | 2-RN independent double-check + 5-rights + witness signature |
| **Blood Transfusion Gate** | MTP, transfusion order | 2-RN bedside check; sample re-label if >30 min old |
| **Time-Critical Gate** | STEMI (90 min), Stroke (60 min), Trauma (15 min) | Server-side timer; auto-escalation if breached |

---

## SNIP-10: CSP Report-Only Default

```javascript
// Default: report-only mode (no blocking, just log violations)
const cspPolicy = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'", "'unsafe-inline'"],  // Tailwind compiled
  imgSrc: ["'self'", 'data:'],
  connectSrc: ["'self'"],
  fontSrc: ["'self'"],
  objectSrc: ["'none'"],
  frameAncestors: ["'none'"],
  reportUri: '/api/csp-report'
};
// helmet.contentSecurityPolicy({ directives: cspPolicy, reportOnly: true });

// To enforce: separate approved deploy
// process.env.CSP_ENFORCE === 'true' → switch to enforcing mode
```

---

## SNIP-11: OpenTelemetry + LangSmith Observability

```javascript
const { trace } = require('@opentelemetry/api');
const langsmith = require('langsmith');

// Every LLM call is traced
async function callLLMWithTrace(prompt, model) {
  const tracer = trace.getTracer('nama-medical-ai');
  return tracer.startActiveSpan(`llm.${model}`, async (span) => {
    span.setAttribute('llm.model', model);
    span.setAttribute('llm.prompt_tokens', prompt.length);
    const start = Date.now();
    const response = await llm.invoke(prompt, { model });
    span.setAttribute('llm.latency_ms', Date.now() - start);
    span.setAttribute('llm.completion_tokens', response.usage.completion_tokens);
    span.setAttribute('llm.cost_usd', response.usage.cost);
    span.end();
    // LangSmith
    await langsmith.logRun({
      name: `llm.${model}`,
      inputs: { prompt_hash: sha256(prompt) },  // never log PHI raw
      outputs: { response_hash: sha256(response.text) },
      tags: ['medical', 'phi-redacted', 'audit-required'],
    });
    return response;
  });
}
```

**PII redaction BEFORE external LLM** — required for HIPAA + PDPL.

---

## SNIP-12: i18n Keys (Common Set)

```json
{
  "common.save": {"en": "Save", "ar": "حفظ"},
  "common.cancel": {"en": "Cancel", "ar": "إلغاء"},
  "common.confirm": {"en": "Confirm", "ar": "تأكيد"},
  "common.patient_mrn": {"en": "MRN", "ar": "رقم الملف"},
  "common.patient_name": {"en": "Patient Name", "ar": "اسم المريض"},
  "common.allergies": {"en": "Allergies", "ar": "الحساسية"},
  "common.pmh": {"en": "Past Medical History", "ar": "التاريخ المرضي"},
  "common.vitals": {"en": "Vitals", "ar": "العلامات الحيوية"},
  "common.notes": {"en": "Notes", "ar": "الملاحظات"},
  "audit.consent_required": {"en": "Patient consent required", "ar": "موافقة المريض مطلوبة"},
  "audit.signed_by": {"en": "Signed by", "ar": "موقّع من"},
  "audit.timestamp": {"en": "Timestamp", "ar": "الطابع الزمني"},
  "red_flag.escalate_now": {"en": "ESCALATE NOW", "ar": "تصعيد فوري"},
  "red_flag.acknowledge": {"en": "Acknowledge", "ar": "إقرار"},
  "high_alert.double_check": {"en": "Double-check required (2 RNs)", "ar": "تحقق مزدوج (ممرضتان)"},
  "high_alert.5_rights": {"en": "5 Rights: Patient, Drug, Dose, Route, Time", "ar": "الحقوق الخمسة: المريض، الدواء، الجرعة، المسار، الوقت"},
  "tenant.scope_required": {"en": "Tenant scope required", "ar": "نطاق المستأجر مطلوب"},
  "rbac.specialty_denied": {"en": "You do not have access to this specialty", "ar": "ليس لديك صلاحية الوصول لهذا التخصص"},
  "cath.d2b_timer": {"en": "Door-to-Balloon", "ar": "من الباب إلى البالون"},
  "cath.activate_stemi": {"en": "Activate STEMI Protocol", "ar": "تفعيل بروتوكول STEMI"},
  "transplant.mmd": {"en": "HLA Mismatch", "ar": "عدم التوافق النسيجي"},
  "transplant.donor_offer": {"en": "Donor Offer", "ar": "عرض متبرع"},
  "trauma.mtp_activate": {"en": "Activate Massive Transfusion Protocol", "ar": "تفعيل بروتوكول النقل الدموي المكثف"},
  "trauma.tier1": {"en": "Tier 1 — Full Trauma Team", "ar": "المستوى 1 — فريق الصدمة الكامل"},
  "trauma.atls_airway": {"en": "A — Airway with C-spine", "ar": "أ — مجرى الهواء مع تثبيت العمود الفقري"}
}
```

---

## ORC sign-off
All 12 snippets ready. 3 POC modules may now `$ref: SNIPPETS.md#SNIP-XX` instead of rewriting. — ORC, 2026-07-24
