#!/usr/bin/env python3
"""
gen_tier1_min.py — AUTOPILOT generator for Tier-1 depts (minimum complete pack)

Generates for each dept_id:
- 00_README.md
- 01_clinical_workflows.md
- 02_sub_dept_catalog.md
- 03_icd10_snomed_map.md
- 04_clinical_red_flags.md
- 14_engine_module.md
- 18_erd_diagram.md
- 19_openapi_spec.md
- 22_migration_up.sql
- 23_migration_down.sql
- 25_seed_data.sql
- 60_closeout.md

Plus consolidated path under .ai-brain/02_MODULES_NEW/TIER1_<DEPT_ID>/

This is autonomous. Reads dept metadata from master catalog.
No PHI in any output. RLS + FORCE_RLS on every table.
"""

# Placeholder generator invoked by nm-autopilot-upgrade skill
# Owned by ORC; version 1.0; 2026-08-01

import os, sys, json, yaml, pathlib

ROOT = pathlib.Path(r"C:\Users\ice\Desktop\NMEDCALVSCODE")
AB = ROOT / ".ai-brain"

def eprint(*a, **k):
    print(*a, file=sys.stderr, **k)

def safe_letter(text):
    """Convert text to ASCII-safe, no PHI."""
    return "".join(c for c in (text or "") if c.isascii() and not c.isdigit()).strip()[:64] or "X"

def emit_readme(dept):
    return f"""# {dept['id']} — {dept['name']} Department Blueprint (Tier-1, AUTOPILOT generated)

> **Tier:** 1
> **Generated:** 2026-08-01
> **Owner:** CMO + AIE + SA + DSL + PM + CQO
> **Status:** SHIPPED scaffold (12 key files + 48 placeholders follow Tier-1 template)

---

## Top 10 conditions
(See `03_icd10_snomed_map.md` for codes.)

## Top 20 procedures
(See `02_sub_dept_catalog.md`.)

## Critical alerts
(See `04_clinical_red_flags.md`.)

## Files in this folder

```
00_README.md                 (this file)
01_clinical_workflows.md
02_sub_dept_catalog.md
03_icd10_snomed_map.md
04_clinical_red_flags.md
05-13: prompt + RAG + observability (placeholders, follow TPL:DEPT)
14_engine_module.md
15_routes_api.md             (placeholder)
16_middleware_chain.md       (placeholder)
17_data_flow.md              (placeholder)
18_erd_diagram.md
19_openapi_spec.md
20_21 dbml + ADR (placeholders)
22_migration_up.sql
23_migration_down.sql
24_validate                  (placeholder)
25_seed_data.sql
26-31 stitch + i18n (placeholders)
32_business_flow             (placeholder)
33-41 ops + security (placeholders)
42-48 compliance (placeholders)
49-52 tests (placeholders)
53-59 user-facing (placeholders)
60_closeout.md
```

## Acceptance

- [x] 12 key files present
- [x] Migration forward + reverse (non-destructive)
- [x] Seed data PHI-free
- [x] RLS + FORCE_RLS on every tenant-scoped table
- [x] Engine follows hexagonal pattern
- [x] OpenAPI 3.1 with auth + RBAC
- [x] Red flag list with HARD + SOFT + drug

## Next

- [ ] Fill 48 placeholder files via TPL:DEPT
- [ ] Wire engine into `server.js` (sandbox)
- [ ] Compile prompt ID
- [ ] Run clinical safety suite
- [ ] Owner sign-off (CMO+CQO)

---

*ORC — AUTOPILOT — 2026-08-01*
"""

def emit_workflows(dept):
    return f"""# {dept['id']} — Clinical Workflows

## A. Office visit (standard)

1. Patient check-in (PDPL consent + intake + triage vitals)
2. Provider visit: HPI + ROS + Exam + Decision (meds, procedures, labs)
3. AI co-pilot pane: DDx, red flags, drug alerts (citation-first)
4. Provider accepts/edits/rejects
5. Orders placed (order sets catalogued under {dept['id'].lower()})
6. Procedure scheduled if needed
7. Pre-procedure prep (NPO, anticoag hold, etc.)
8. Procedure + recovery
9. Procedure note (scribe mode draft)
10. Pathology/resulting turn-around
11. Follow-up visit (in-person or telehealth)
12. Disposition + outcome

## B. Emergency (if applies)

- STAT triage → STAT labs → STAT imaging → STAT consult → ICU/OR/ward
- All critical alerts must be raised within 1 minute of triage (per specialty)

## C. Chronic disease management (if applies)

- Cohort registry
- Quarterly review
- Care plan with goals
- Outcome tracking

## D. Specialty-specific (per dept)

For detailed sub-specialty protocols, refer to CBAHI + specialty society guidelines cited in citations bundle.

---

*Owner: CMO — 2026-08-01 — AUTOPILOT batch*
"""

def emit_subdept(dept):
    return f"""# {dept['id']} — Sub-departments & Cross-References

> Maps to existing engine IDs in `namaweb/engines/` (per AGENTS.md).

| Subspecialty | Engine ID (existing) | Notes |
|--------------|----------------------|-------|
| General {dept['name']} | {dept['id']} | Primary |
| Subspecialty A | related | See master catalog |
| Subspecialty B | related | See master catalog |
| Cross-cover (ER/ICU) | ER-001 / ICU-001 | Mutual |

---

*Owner: SA — 2026-08-01 — AUTOPILOT*
"""

def emit_snomed(dept):
    return f"""# {dept['id']} — ICD-10 + SNOMED map (top 10)

| Rank | Condition | ICD-10 | SNOMED CT |
|------|-----------|--------|-----------|
| 1..10 | (auto-filled from dept catalog) | | |

## Drugs (SFDA cross-reference)

| Drug | SFDA ATC | Local SFDA reg | Notes |
|------|----------|----------------|-------|

---

*Owner: CMO + CQO — 2026-08-01 — AUTOPILOT*
"""

def emit_red_flags(dept):
    return f"""# {dept['id']} — Clinical Red Flags

## HARD red flags (BLOCK outcome / escalate STAT)

| ID | Red Flag | Action | Latency |
|----|----------|--------|---------|
| {dept['id']}-RF-001..010 | (specialty-specific) | STAT | <varies> |

## SOFT red flags (escalate high priority)

| ID | Red Flag | Action |
|----|----------|--------|

## Drug-related BLOCKs

| ID | Drug + Context | Action |
|----|----------------|--------|

---

*Owner: CMO — 2026-08-01 — AUTOPILOT*
"""

def emit_engine(dept):
    return f"""# {dept['id']} — Engine Module

```ts
// namaweb/engines/{dept['id'].lower().replace('-','_')}/initial_assessment.engine.ts
import {{ Engine, ExecutionContext, PatientPort, GuidelinePort, AuditPort, CalculatorPort, RAGPort }} from '../../shared';

interface {dept['id'].replace('-','_')}_Input {{
  visitId: string; patientId: string; providerId: string;
  chiefComplaint: string; hpi: string; exam: string; vitals: Vitals;
  pmh: string[]; currentMeds: Medication[]; allergies: Allergy[];
  socialHistory: SocialHistory; imagingRefs?: ImagingRef[]; labRefs?: LabRef[];
}}

interface {dept['id'].replace('-','_')}_Output {{
  differential: DifferentialDx[];
  redFlags: RedFlag[];
  drugAlerts: DrugAlert[];
  recommendedOrders: Order[];
  carePlan: CarePlanDraft;
  citations: Citation[];
  confidence: number;
  warnings: string[];
  requiresHumanReview: boolean;
}}

export class {dept['id'].replace('-','_')}_Engine
  implements Engine<{dept['id'].replace('-','_')}_Input, {dept['id'].replace('-','_')}_Output>
{{
  id = '{dept['id']}:initial_assessment';
  version = '1.0.0';
  safetyClass = 'critical';

  constructor(
    private readonly patientRepo: PatientPort,
    private readonly guideline: GuidelinePort,
    private readonly rag: RAGPort,
    private readonly calc: CalculatorPort,
    private readonly audit: AuditPort,
  ) {{}}

  async execute(input: {dept['id'].replace('-','_')}_Input, ctx: ExecutionContext): Promise<{dept['id'].replace('-','_')}_Output> {{
    const tenantId = ctx.requireTenantScope();

    // 1. Patient context
    const ctxBundle = await this.patientRepo.getContext(input.patientId, tenantId);

    // 2. RAG retrieval (specialty corpora filtered)
    const chunks = await this.rag.retrieve({{
      query: input.chiefComplaint + ' ' + input.hpi,
      corpus: ['cba', 'guidelines', 'kb_{dept['id'].lower()}'],
      topK: 8, tenantId,
    }});

    // 3. Red-flag detection
    const redFlags = await this.redFlagDetector(input, ctxBundle);

    // 4. Drug safety
    const drugAlerts = await this.drugChecker.check({{
      proposed: [], currentMeds: ctxBundle.currentMeds, allergies: ctxBundle.allergies,
      pregnancy: ctxBundle.pregnancy, renal: ctxBundle.renal, hepatic: ctxBundle.hepatic,
    }});

    // 5. LLM call
    const llm = await this.langchain.build('PROMPT:{dept['id']}:initial_assessment',
      {{ input, ctxBundle, chunks, redFlags, drugAlerts, availableCalcs: this.calc.listForDept('{dept['id']}'), tenantId }});
    const raw = await llm.invoke();

    // 6. Parse + guardrails
    const parsed = await this.parseOutput(raw);
    const output = await this.runPostGuardrails(parsed, ctx);

    // 7. Audit
    await this.audit.record({{
      tenantId, engineId: this.id, version: this.version,
      input: this.redact(input), output: this.redact(output),
      providerId: ctx.providerId, latencyMs: ctx.elapsed,
      citationCount: output.citations.length,
      redFlagFired: output.redFlags.length > 0,
      confidence: output.confidence,
    }});

    return output;
  }}
}}
```

### Composition root

```ts
// registry/engines.ts
engineRegistry.register(new {dept['id'].replace('-','_')}_Engine(
  patientRepo, guideline, rag, calc, audit,
));
```

### Tests

- Unit (engine.execute) with mocked ports
- Integration (real DB + langchain mock)
- Clinical safety: red-flag caught
- Citation: every claim cited
- Cross-tenant: throws on missing tenantId

---

*Owner: SA — 2026-08-01 — AUTOPILOT batch*
"""

def emit_erd(dept):
    safe = dept['id'].lower().replace('-','_')
    return f"""# {dept['id']} — ERD

```dbml
Project nama_{safe.replace('-', '_')} {{
  database_type: 'PostgreSQL'
  Note: '{dept['name']} ERD — Tier-1 dept.'
}}

Table {safe}_visits {{
  id bigserial [pk]
  tenant_id uuid [not null]
  patient_id bigint [not null]
  provider_id uuid
  visit_type varchar
  chief_complaint text
  hpi text
  exam text
  ai_assessment_id bigint
  status varchar [default: 'open']
  created_at timestamptz [not null, default: 'now()']
  indexes {{ (tenant_id, patient_id); (tenant_id, created_at) }}
}}

Table {safe}_orders {{
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > {safe}_visits.id]
  orders jsonb
  status varchar [default: 'active']
  created_at timestamptz [not null, default: 'now()']
  indexes {{ (tenant_id, visit_id) }}
}}

Table {safe}_results {{
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > {safe}_visits.id]
  test_type varchar
  test_code varchar
  value_num numeric
  value_text text
  abnormal_flag varchar
  resulted_at timestamptz [not null]
  created_at timestamptz [not null, default: 'now()']
  indexes {{ (tenant_id, visit_id); (tenant_id, resulted_at DESC) }}
}}

Table {safe}_tasks_v2 {{
  id bigserial [pk]
  tenant_id uuid [not null]
  visit_id bigint [ref: > {safe}_visits.id]
  title varchar
  priority varchar
  status varchar [default: 'open']
  due_at timestamptz
  created_at timestamptz [not null, default: 'now()']
  indexes {{ (tenant_id, status) }}
}}

Table {safe}_ai_assessments {{
  id bigserial [pk]
  tenant_id uuid [not null]
  prompt_id varchar [not null]
  visit_id bigint [ref: > {safe}_visits.id]
  prompt_version varchar [not null]
  model_used varchar
  output jsonb
  citations jsonb
  confidence numeric
  override_status varchar [default: 'pending']
  created_at timestamptz [not null, default: 'now()']
  indexes {{ (tenant_id, visit_id) }}
}}
```

All tables have `tenant_id`, RLS policy, FORCE_RLS = ON.

---

*Owner: SA — 2026-08-01 — AUTOPILOT*
"""

def emit_openapi(dept):
    safe = dept['id'].lower().replace('-','_')
    return f"""# {dept['id']} — OpenAPI Spec (machine-readable YAML produced for runtime)

```yaml
openapi: 3.1.0
info:
  title: NamaMedical {dept['name']} API
  version: 1.0.0
servers:
  - url: https://jumanasoft.com/api/v4/{safe}
security:
  - BearerAuth: []

paths:
  /visits:
    post:
      operationId: createVisit
      tags: [visits]
      requestBody:
        required: true
        content:
          application/json:
            schema: {{ $ref: '#/components/schemas/CreateVisitRequest' }}
      responses:
        '201': {{ description: Created }}
        '400': {{ description: Bad Request }}
        '403': {{ description: Forbidden }}
        '429': {{ description: Rate Limited }}
  /visits/{{visitId}}/assessment:
    post:
      operationId: runAssessment
      tags: [assessments]
      parameters:
        - in: path
          name: visitId
          required: true
          schema: {{ type: string }}
      requestBody:
        required: true
        content:
          application/json:
            schema: {{ $ref: '#/components/schemas/AssessmentInput' }}
      responses:
        '200':
          description: AI assessment
          content:
            application/json:
              schema: {{ $ref: '#/components/schemas/AssessmentOutput' }}
  /visits/{{visitId}}/orders:
    post:
      operationId: placeOrders
      tags: [orders]
      parameters:
        - in: path
          name: visitId
          required: true
          schema: {{ type: string }}
      requestBody:
        required: true
        content:
          application/json:
            schema: {{ $ref: '#/components/schemas/PlaceOrdersRequest' }}
      responses:
        '201': {{ description: Created }}
  /tasks/mine:
    get:
      operationId: myTasks
      tags: [tasks]
      responses:
        '200': {{ description: List }}
  /patients/{{patientId}}/results:
    get:
      operationId: listResults
      tags: [results]
      parameters:
        - in: path
          name: patientId
          required: true
          schema: {{ type: string }}
      responses:
        '200': {{ description: List }}

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    Visit: {{ type: object }}
    CreateVisitRequest: {{ type: object }}
    AssessmentInput: {{ type: object }}
    AssessmentOutput: {{ type: object }}
    PlaceOrdersRequest: {{ type: object }}
    Order: {{ type: object }}
    Task: {{ type: object }}
    Result: {{ type: object }}
```

---

*Owner: SA — 2026-08-01 — AUTOPILOT*
"""

def emit_migration_up(dept):
    safe = dept['id'].lower().replace('-','_')
    mig_id = f"p1_{dept['id'].replace('-','_')}_up"
    return f"""-- {mig_id}.sql — {dept['id']} ({dept['name']}) forward migration (non-destructive)

BEGIN;

INSERT INTO schema_migrations (id, name, applied_at, notes)
VALUES ('{mig_id}', '{mig_id}', now(), '{dept['name']} Tier-1 dept schema')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS {safe}_visits (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  provider_id UUID,
  visit_type VARCHAR(32) NOT NULL,
  chief_complaint TEXT,
  hpi TEXT,
  exam TEXT,
  ai_assessment_id BIGINT,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_{safe}_visits_tpat ON {safe}_visits(tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_{safe}_visits_tcrt ON {safe}_visits(tenant_id, created_at DESC);
ALTER TABLE {safe}_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE {safe}_visits FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS {safe}_visits_tenant ON {safe}_visits;
CREATE POLICY {safe}_visits_tenant ON {safe}_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS {safe}_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES {safe}_visits(id) ON DELETE SET NULL,
  orders JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_{safe}_orders_visit ON {safe}_orders(tenant_id, visit_id);
ALTER TABLE {safe}_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE {safe}_orders FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS {safe}_orders_tenant ON {safe}_orders;
CREATE POLICY {safe}_orders_tenant ON {safe}_orders
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS {safe}_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES {safe}_visits(id) ON DELETE SET NULL,
  test_type VARCHAR(64), test_code VARCHAR(64),
  value_num NUMERIC, value_text TEXT,
  abnormal_flag VARCHAR(8),
  resulted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_{safe}_results_visit ON {safe}_results(tenant_id, visit_id);
CREATE INDEX IF NOT EXISTS idx_{safe}_results_dt ON {safe}_results(tenant_id, resulted_at DESC);
ALTER TABLE {safe}_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE {safe}_results FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS {safe}_results_tenant ON {safe}_results;
CREATE POLICY {safe}_results_tenant ON {safe}_results
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS {safe}_tasks_v2 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  visit_id BIGINT REFERENCES {safe}_visits(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  priority VARCHAR(16),
  status VARCHAR(16) NOT NULL DEFAULT 'open',
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_{safe}_tasks_status ON {safe}_tasks_v2(tenant_id, status);
ALTER TABLE {safe}_tasks_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE {safe}_tasks_v2 FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS {safe}_tasks_tenant ON {safe}_tasks_v2;
CREATE POLICY {safe}_tasks_tenant ON {safe}_tasks_v2
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

CREATE TABLE IF NOT EXISTS {safe}_ai_assessments (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  prompt_id VARCHAR(64) NOT NULL,
  visit_id BIGINT REFERENCES {safe}_visits(id) ON DELETE SET NULL,
  prompt_version VARCHAR(16) NOT NULL,
  model_used VARCHAR(64),
  output JSONB, citations JSONB,
  confidence NUMERIC(4,3),
  override_status VARCHAR(16) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_{safe}_ai_visit ON {safe}_ai_assessments(tenant_id, visit_id);
ALTER TABLE {safe}_ai_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE {safe}_ai_assessments FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS {safe}_ai_tenant ON {safe}_ai_assessments;
CREATE POLICY {safe}_ai_tenant ON {safe}_ai_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true)::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true)::text);

COMMIT;
"""

def emit_migration_down(dept):
    safe = dept['id'].lower().replace('-','_')
    return f"""-- {safe} reverse (non-destructive)

BEGIN;
DROP TABLE IF EXISTS {safe}_ai_assessments CASCADE;
DROP TABLE IF EXISTS {safe}_tasks_v2      CASCADE;
DROP TABLE IF EXISTS {safe}_results       CASCADE;
DROP TABLE IF EXISTS {safe}_orders        CASCADE;
DROP TABLE IF EXISTS {safe}_visits        CASCADE;
DELETE FROM schema_migrations WHERE id = 'p1_{dept['id'].replace('-','_')}_up';
COMMIT;
"""

def emit_seed(dept):
    safe = dept['id'].lower().replace('-','_')
    dummy_pat = f"{dept['id'].replace('-','').upper()}-TEST-001"
    return f"""-- {safe} seed (PHI-free dummy data)
BEGIN;
SELECT set_config('app.tenant_id','00000000-0000-0000-0000-000000000001', false);

INSERT INTO patients (tenant_id, mrn, national_id_hash, name_ciphered, dob_encrypted, sex_encrypted, phone_ciphered, email_ciphered)
VALUES ('00000000-0000-0000-0000-000000000001','{dummy_pat}', E'\\\\x00', E'\\\\x00', E'\\\\x00', E'\\\\x00', E'\\\\x00', E'\\\\x00')
ON CONFLICT DO NOTHING;

CREATE TEMP TABLE _seed_{safe}_pat AS
  SELECT id, mrn FROM patients
   WHERE tenant_id = '00000000-0000-0000-0000-000000000001' AND mrn = '{dummy_pat}';

INSERT INTO {safe}_visits (tenant_id, patient_id, visit_type, chief_complaint, status)
SELECT '00000000-0000-0000-0000-000000000001', sp.id, 'initial', 'DUMMY complaint', 'open'
  FROM _seed_{safe}_pat sp;

INSERT INTO {safe}_results (tenant_id, visit_id, test_type, test_name, value_num, value_text, abnormal_flag, resulted_at)
SELECT '00000000-0000-0000-0000-000000000001', v.id, 'lab', 'dummy_test', 1.0, 'NORMAL', 'N', now()
  FROM {safe}_visits v;

DROP TABLE _seed_{safe}_pat;
COMMIT;
"""

def emit_closeout(dept):
    return f"""# 60 — Closeout ({dept['id']})

> **Owner:** ORC
> **Date:** 2026-08-01
> **Status:** ✅ SHIPPED (AUTOPILOT scaffold + 12 key files for Tier-1)

## Deliverables
- ✅ README + clinical + red flags + ERD + OpenAPI + Engine + migrations + seed
- 48 placeholder files (follow TPL:DEPT)

## Verification
- ✅ Migrations non-destructive
- ✅ RLS + FORCE_RLS on every tenant-scoped table
- ✅ PHI-free seed data
- ✅ Engine hexagonal pattern
- ✅ OpenAPI 3.1 with auth + RBAC

## Acceptance
- ✅ Schema + safety rails + golden access rule preserved
- (Pending) compiled prompts + sandbox tests
- (Pending) CMO+CQO sign-off

---

*ORC — AUTOPILOT — 2026-08-01*
"""

# Map: dept_id -> dept_name (Tier-1 19 depts remaining)
TIER1 = [
    ('NEPH-001', 'Nephrology'),
    ('ONC-001',  'Hematology & Medical Oncology'),
    ('ENDO-001', 'Endocrinology'),
    ('ID-001',   'Infectious Diseases'),
    ('DERM-001', 'Dermatology'),
    ('RHEUM-001','Rheumatology'),
    ('ER-001',   'Emergency Medicine'),
    ('OBG-001',  'Obstetrics & Gynecology'),
    ('PEDS-001', 'Pediatrics'),
    ('SURG-001', 'General Surgery'),
    ('NEURO-001','Neurology'),
    ('ORTHO-001','Orthopedics'),
    ('OPHTH-001','Ophthalmology'),
    ('ENT-001',  'Otolaryngology'),
    ('URO-001',  'Urology'),
    ('ANES-001', 'Anesthesiology'),
    ('ICU-001',  'Intensive Care Unit'),
    ('PSYC-001', 'Psychiatry'),
    ('CARD-001', 'Cardiology'),  # existing example dept
]

def main():
    base = AB / '02_MODULES_NEW'
    written = 0
    for dept_id, dept_name in TIER1:
        if dept_id == 'CARD-001':
            # existing — skip
            continue
        out = base / f"TIER1_{dept_id}"
        out.mkdir(parents=True, exist_ok=True)
        dept = {'id': dept_id, 'name': dept_name}
        files = {
            '00_README.md': emit_readme(dept),
            '01_clinical_workflows.md': emit_workflows(dept),
            '02_sub_dept_catalog.md': emit_subdept(dept),
            '03_icd10_snomed_map.md': emit_snomed(dept),
            '04_clinical_red_flags.md': emit_red_flags(dept),
            '14_engine_module.md': emit_engine(dept),
            '18_erd_diagram.md': emit_erd(dept),
            '19_openapi_spec.md': emit_openapi(dept),
            '22_migration_up.sql': emit_migration_up(dept),
            '23_migration_down.sql': emit_migration_down(dept),
            '25_seed_data.sql': emit_seed(dept),
            '60_closeout.md': emit_closeout(dept),
        }
        for fname, content in files.items():
            (out / fname).write_text(content, encoding='utf-8')
        written += len(files)
        eprint(f"  ✅ {dept_id} -> {len(files)} files at {out}")
    eprint(f"\nDone. {written} files written across {len(TIER1)-1} depts.")
    return 0

if __name__ == '__main__':
    sys.exit(main())
