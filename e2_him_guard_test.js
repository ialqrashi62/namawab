/**
 * e2_him_guard_test.js — static assertions for E2 (Medical Records / HIM).
 * No DB / no HTTP / no PHI. Run: node e2_him_guard_test.js
 *
 * Asserts:
 *   - server endpoints exist, are auth+RBAC+tenant-scope guarded
 *   - longitudinal record access is logged (record_access_log) + audited
 *   - coding stamps tenant_id from session (not body) + FORCE-RLS migration canonical
 *   - ROI workflow states + RBAC + audit
 *   - break-glass requires reason + raises BREAK_GLASS alert
 *   - migrations follow the canonical FORCE-RLS template + are idempotent (up/down/validate)
 *   - client screen wired with tr()+escapeHTML+safeId; app.js not broken
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const server = fs.readFileSync(path.join(ROOT, 'server.js'), 'utf8');
const app = fs.readFileSync(path.join(ROOT, 'public', 'js', 'app.js'), 'utf8');
const mig = (n) => fs.readFileSync(path.join(ROOT, 'migrations', n), 'utf8');

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('  PASS', m); } else { fail++; console.log('  FAIL', m); } };

console.log('\n=== [1] ROLE / RBAC ===');
ok(/'HIM':\s*\[/.test(server), 'HIM role added to ROLE_PERMISSIONS');
ok(/'him',\s*'medical-records'/.test(server), "Doctor/HIM granted 'him' + 'medical-records' modules");

console.log('\n=== [2] LONGITUDINAL RECORD ENDPOINT (access-logged) ===');
ok(server.includes("app.get('/api/him/record/:patientId', requireAuth, requireRole('him', 'medical-records'), requireTenantScope"), 'GET /api/him/record/:patientId auth+RBAC+tenant-scope guarded');
ok(/INSERT INTO record_access_log[\s\S]{0,200}'normal'/.test(server), 'every record open writes record_access_log (normal)');
ok(/'VIEW_RECORD'/.test(server), 'record open raises VIEW_RECORD audit');
ok(/Patient not found/.test(server) && /WHERE id=\$1\$\{tenantCheck\}/.test(server), 'patient verified within tenant (fail-closed 404)');
ok(/_himPushSource/.test(server) && /table may not exist yet/.test(server), 'aggregation degrades gracefully for optional tables (problems/clinical_notes/coding)');
ok(/FROM problems WHERE patient_id/.test(server) && /FROM clinical_notes WHERE patient_id/.test(server), 'aggregates E1 problems + clinical_notes');
ok(/FROM medical_records WHERE patient_id/.test(server) && /FROM prescriptions WHERE patient_id/.test(server) && /FROM lab_radiology_orders/.test(server), 'aggregates records + prescriptions + lab/rad');

console.log('\n=== [3] CODING ENDPOINT ===');
ok(server.includes("app.post('/api/him/coding', requireAuth, requireRole('him', 'medical-records'), requireTenantScope"), 'POST /api/him/coding guarded');
ok(server.includes("app.get('/api/him/coding', requireAuth, requireRole('him', 'medical-records'), requireTenantScope"), 'GET /api/him/coding guarded');
ok(/INSERT INTO coding \(tenant_id, facility_id, patient_id/.test(server), 'coding INSERT stamps tenant_id first column');
ok(/\[tenantId, facilityId[\s\S]{0,160}cs, String\(code\)/.test(server), 'tenant_id from session (getRequestTenantContext), not from body');
ok(/'ADD_CODING'/.test(server), 'coding add audited (ADD_CODING)');
ok(server.includes("app.get('/api/him/deficiencies'"), 'deficiencies endpoint exists');
ok(/unsigned_record/.test(server) && /missing_coding/.test(server), 'deficiencies flag unsigned records + missing coding');

console.log('\n=== [4] ROI WORKFLOW ===');
ok(server.includes("app.post('/api/him/roi', requireAuth, requireRole('him', 'medical-records'), requireTenantScope"), 'POST /api/him/roi guarded');
ok(server.includes("app.put('/api/him/roi/:id', requireAuth, requireRole('him', 'medical-records'), requireTenantScope"), 'PUT /api/him/roi/:id guarded');
ok(/INSERT INTO roi_requests \(tenant_id, facility_id, patient_id/.test(server), 'ROI INSERT stamps tenant_id first');
ok(/Only pending requests can be approved/.test(server) && /Only approved requests can be released/.test(server), 'ROI state machine enforced (pending->approved->released)');
ok(/'ROI_REQUEST'/.test(server) && /'ROI_APPROVE'/.test(server) && /'ROI_DENY'/.test(server) && /'ROI_RELEASE'/.test(server), 'ROI actions audited');

console.log('\n=== [5] ACCESS LOG + BREAK-GLASS ===');
ok(server.includes("app.get('/api/him/access-log', requireAuth, requireRole('him', 'medical-records'), requireTenantScope"), 'GET /api/him/access-log guarded');
ok(server.includes("app.post('/api/him/break-glass', requireAuth, requireRole('him', 'medical-records'), requireTenantScope"), 'POST /api/him/break-glass guarded');
ok(/Break-glass reason required/.test(server), 'break-glass requires a reason (400 otherwise)');
ok(/access_type[\s\S]{0,60}'break_glass'/.test(server) || /'break_glass',\$5/.test(server), 'break-glass writes break_glass access row');
ok(/'BREAK_GLASS'/.test(server), 'break-glass raises BREAK_GLASS audit alert');

console.log('\n=== [6] MIGRATIONS — FORCE RLS canonical + idempotent ===');
const upFiles = ['e2_01_coding_up.sql', 'e2_02_roi_up.sql', 'e2_03_record_access_up.sql'];
const tables = { 'e2_01_coding_up.sql': 'coding', 'e2_02_roi_up.sql': 'roi_requests', 'e2_03_record_access_up.sql': 'record_access_log' };
for (const f of upFiles) {
  const s = mig(f); const t = tables[f];
  ok(s.includes('CANDIDATE ONLY'), `${f}: CANDIDATE-ONLY banner`);
  ok(new RegExp(`CREATE TABLE IF NOT EXISTS ${t}`).test(s), `${f}: CREATE TABLE IF NOT EXISTS ${t} (idempotent)`);
  ok(/tenant_id INTEGER NOT NULL REFERENCES tenants\(id\)/.test(s), `${f}: tenant_id NOT NULL FK -> tenants(id)`);
  ok(new RegExp(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY`).test(s) && new RegExp(`ALTER TABLE ${t} FORCE ROW LEVEL SECURITY`).test(s), `${f}: ENABLE + FORCE RLS`);
  ok(s.includes("USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)"), `${f}: canonical fail-closed USING policy`);
  ok(s.includes("WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)"), `${f}: canonical fail-closed WITH CHECK policy`);
  ok(new RegExp(`DROP POLICY IF EXISTS rls_${t}_tenant_isolation`).test(s), `${f}: DROP POLICY IF EXISTS (idempotent)`);
  ok(new RegExp(`CREATE INDEX IF NOT EXISTS idx_${t}_tenant_id`).test(s), `${f}: tenant_id index (idempotent)`);
}
for (const f of upFiles) {
  const down = f.replace('_up.sql', '_down.sql');
  const val = f.replace('_up.sql', '_validate.sql');
  ok(fs.existsSync(path.join(ROOT, 'migrations', down)), `${down} exists`);
  ok(fs.existsSync(path.join(ROOT, 'migrations', val)), `${val} exists`);
  ok(/DROP TABLE IF EXISTS/.test(mig(down)), `${down}: idempotent DROP TABLE IF EXISTS`);
  ok(/relforcerowsecurity/.test(mig(val)), `${val}: validates FORCE RLS`);
}
// CHECK constraints present
ok(/code_system IN \('ICD10', 'SNOMED', 'CPT'\)/.test(mig('e2_01_coding_up.sql')), 'coding: code_system CHECK (ICD10/SNOMED/CPT)');
ok(/status IN \('pending', 'approved', 'released', 'denied'\)/.test(mig('e2_02_roi_up.sql')), 'roi: status CHECK');
ok(/access_type IN \('normal', 'break_glass'\)/.test(mig('e2_03_record_access_up.sql')), 'record_access_log: access_type CHECK');

console.log('\n=== [7] CLIENT (app.js) ===');
ok(/viewLongitudinalRecord/.test(app), 'longitudinal record viewer wired');
ok(/'\/api\/him\/record\/'/.test(app), 'client calls GET /api/him/record');
ok(/breakGlassRecord/.test(app) && /Break-glass requires a reason/.test(app), 'break-glass UI requires reason');
ok(/window\.addCoding/.test(app) && /window\.createROI/.test(app) && /window\.actROI/.test(app), 'coding + ROI client handlers present');
ok(/isHimAdmin/.test(app) && /mrTab === 'access'/.test(app), 'access-log tab gated to Admin/HIM');
ok(/escapeHTML\(/.test(app.slice(app.indexOf('viewLongitudinalRecord'))), 'longitudinal viewer escapes PHI (escapeHTML)');
ok(/safeId\(/.test(app.slice(app.indexOf('renderMedicalRecords'))), 'HIM screen uses safeId for ids');
ok(/window\.submitMRRequest/.test(app) && /window\.updateMRRequest/.test(app), 'legacy MR request handlers preserved (no regression)');

console.log(`\n${fail === 0 ? 'ALL PASS' : 'FAILURES'}: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
