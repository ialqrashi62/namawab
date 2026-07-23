# Snippets — Reusable Blocks for AI Brain Generation

> 13 snippets referenced across all 35-file dept blueprints. Replacing repeated boilerplate
> with `[SNIPPET:ID]` markers saves ~70% tokens. Orchestrator expands at integration time.

---

## [S1] Header Block

```markdown
> **Department:** {{dept_name}}
> **Group:** {{group_name}}
> **Owner:** {{owner_role}}
> **Status:** {{status}}
> **Created:** {{date}}
> **Last Updated:** {{date}}
> **Safety Rails:** All 13 from `AGENTS.md §2.2` apply
```

---

## [S2] Tenant Isolation Pattern

```javascript
// Every protected route:
app.<verb>('/api/<area>/<path>',
    requireAuth,                  // session
    requireTenantScope,           // tenant isolation (FAIL-CLOSED)
    requireRole('<area>'),        // authz
    validateBody(RS.<schema>),    // input validation (FAIL-CLOSED)
    idempotencyGuard,             // money/claim routes only
    async (req, res) => { ... }
);
```

---

## [S3] PHI Encryption Pattern

```javascript
const ce = require('./crypto_envelope');
const plainBuf = fs.readFileSync(filePath);
const sha256 = require('crypto').createHash('sha256').update(plainBuf).digest('hex');
if (ce.isEnabled()) {
    fs.writeFileSync(filePath, Buffer.from(ce.encrypt(plainBuf), 'utf8'));
}
```

---

## [S4] 7-Expert Panel Reference

```markdown
Inputs synthesized from:
- CMO: clinical workflows + ICD-10/SNOMED + red flags
- AI Engineer: RAG chains + vector store + LLM prompts
- Architect: DB schema + OpenAPI + engines + routes
- DevOps: migration + CI/CD + runbook
- UX: Stitch layout + wireframes + i18n
- Compliance: JCI + ISO 9001 + PDPL + NPHIES
- Orchestrator: synthesis + master index + safety gates
```

---

## [S5] Stitch Layout Picker

| Layout | Use for | Color | Pattern |
|---|---|---|---|
| A | 3-col clinical workspace | sky | nav-chart-tools |
| B | Dashboard (centers) | teal | kpi-charts-activity |
| C | Wizard (intake/triage) | indigo | step-progress-form |
| D | Chart-heavy | rose | tabs-timeline-trend |
| E | Timeline (ED, ICU, OB) | amber | vertical-timeline-vitals |
| F | Imaging | emerald | image-annotations-report |
| G | Forms | purple | sectioned-autosave |
| H | Queue + Detail | blue | top-queue-bottom-detail |

---

## [S6] RAG Vector Store Schema

```sql
CREATE TABLE clinical_knowledge_chunks (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    department_id INTEGER,
    content_chunk TEXT NOT NULL,
    embedding REAL[] NOT NULL,          -- 1536-dim OpenAI ada-002
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    -- RLS
    FORCE ROW LEVEL SECURITY,
    POLICY rls_ckc_tenant ON clinical_knowledge_chunks
        USING (tenant_id = current_setting('app.tenant_id')::int)
        WITH CHECK (tenant_id = current_setting('app.tenant_id')::int)
);
CREATE INDEX idx_ckc_tenant ON clinical_knowledge_chunks(tenant_id);
```

---

## [S7] i18n Key Naming

```
<dept>.<section>.<element>     e.g. cardiology.tab.ecg
<dept>.btn.<action>             e.g. cardiology.btn.order_lab
<dept>.lbl.<field>              e.g. cardiology.lbl.bp
<dept>.msg.<context>            e.g. cardiology.msg.critical_alert
<dept>.err.<reason>             e.g. cardiology.err.tenant_required
```

EN + AR pairs required for every key.

---

## [S8] Audit Logging

```javascript
async function logAudit(userId, userName, action, module, details, ip) {
    await pool.query(
        'INSERT INTO audit_trail (user_id, username, action, module, new_values, ip_address) VALUES ($1,$2,$3,$4,$5,$6)',
        [userId, userName || '', action || '', module || '', details || '', ip || '']
    );
}
```

---

## [S9] Migration Template

```sql
-- migrations/eN_<dept>_<feature>_up.sql
BEGIN;
CREATE TABLE <dept>_<table> (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER,
    -- ...dept-specific columns
    created_at TIMESTAMPTZ DEFAULT now(),
    -- RLS
    FORCE ROW LEVEL SECURITY,
    POLICY rls_<dept>_<table> ON <dept>_<table>
        USING (tenant_id = current_setting('app.tenant_id')::int)
        WITH CHECK (tenant_id = current_setting('app.tenant_id')::int)
);
CREATE INDEX idx_<dept>_<table>_tenant ON <dept>_<table>(tenant_id);
COMMIT;
```

Down version reverses (DROP POLICY, DROP TABLE, no data loss if table was empty).

---

## [S10] OpenAPI Stub

```yaml
paths:
  /api/<dept>/<resource>:
    get:
      summary: List <resource>
      security: [sessionAuth: []]
      parameters:
        - in: query
          name: patient_id
          schema: { type: integer }
      responses:
        200: { description: OK }
        403: { description: Tenant scope required }
        404: { description: Not found }
```

---

## [S11] Unit Test Skeleton

```javascript
// <dept>_engine_unit_test.js
const assert = require('assert');
const engine = require('./<dept>_engine');

let passed = 0, failed = 0;
function test(name, fn) {
    try { fn(); passed++; }
    catch (e) { failed++; console.log(`FAIL ${name}: ${e.message}`); }
}

test('function returns expected shape', () => {
    const r = engine.<functionName>({ /* input */ });
    assert.ok(r.value !== undefined);
    assert.ok(['low', 'medium', 'high', 'critical'].includes(r.severity));
});

// ... more tests

console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
```

---

## [S12] Integration Test Skeleton

```javascript
// <dept>_routes_integration_test.js
const assert = require('assert');
const src = require('fs').readFileSync('./server.js', 'utf8');

test('route exists', () => {
    assert.ok(src.includes("app.get('/api/<dept>/<path>'"));
});
test('route guarded by requireAuth + requireRole', () => {
    const idx = src.indexOf("app.get('/api/<dept>/<path>'");
    const block = src.slice(idx, idx + 200);
    assert.ok(block.includes('requireAuth'));
    assert.ok(block.includes("requireRole('<area>')"));
});
test('route applies tenant filter', () => {
    const idx = src.indexOf("app.get('/api/<dept>/<path>'");
    const block = src.slice(idx, idx + 1000);
    assert.ok(block.includes('tenant_id'));
});
```

---

## [S13] Stitch HTML Wrapper

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <title>{{dept_name}} — NamaMedical</title>
    <link rel="stylesheet" href="/css/<dept>-tokens.css">
</head>
<body class="bg-slate-50 text-slate-900 font-sans">
    <div id="app" class="grid grid-cols-12 gap-4 h-screen p-4">
        <!-- Layout A: 3-col clinical workspace -->
        <aside class="col-span-3 bg-white rounded-xl p-4 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">{{dept_name}}</h2>
            <nav id="dept-nav"></nav>
        </aside>
        <main class="col-span-6 bg-white rounded-xl p-4 shadow-sm">
            <div id="dept-main"></div>
        </main>
        <aside class="col-span-3 bg-white rounded-xl p-4 shadow-sm">
            <div id="dept-tools"></div>
        </aside>
    </div>
    <script src="/js/<dept>-station.js"></script>
</body>
</html>
```

---

## Per-file snippet usage (for reference)

| File | Snippets |
|---|---|
| README.md | S1, S4 |
| 00_synthesis.md | S1, S2, S3, S4, S5, S6 |
| 01_clinical_workflows.md | (none — pure clinical content) |
| 01_rag_chains.md | S6, S7 |
| 01_dbml_schema.md | S9 |
| 01_stitch_layout.md | S5, S13 |
| 01_jci_checklist.md | (none — compliance text) |
| 01_migration_up.sql | S9 |
| 01_unit_tests.md | S11 |
| 01_user_manual.md | S7 |
| 02_openapi_spec.md | S10 |
| 02_routes_api.md | S2, S8 |
| 03_engine_module.md | (code only) |
| 04_cicd_runbook.md | (none — ops text) |
