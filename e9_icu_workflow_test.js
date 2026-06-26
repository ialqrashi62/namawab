/**
 * e9_icu_workflow_test.js
 * ==========================================
 * E9 ICU / Critical Care — workflow + admission-scoping tests.
 * DB-free: static-audits the guarded /api/icu/* routes in server.js, then re-simulates the
 * server's e9LoadActiveIcuAdmission gate + the board acuity-sort against an in-memory mock
 * (mirrors e8_adt_workflow_test.js).
 *
 *   NODE_PATH=.../namaweb/node_modules node e9_icu_workflow_test.js
 *
 * Asserts:
 *   - every new /api/icu/* route is auth+role+tenant guarded (requireRole('icu','nursing','doctor'))
 *   - e9RequireTenant fail-closed helper present (null tenant => 403)
 *   - scores computed SERVER-SIDE via icuScoring.computeICUScores (client score ignored)
 *   - flowsheet/vent/infusion/score attach ONLY to an Active, tenant-owned, ICU-ward admission
 *   - non-positive id => 422 ; cross-tenant / missing => 404 ; non-Active (Discharged) => 409 ;
 *     non-ICU ward => 409
 *   - ICU board sorted by acuity (sickest/highest SOFA first)
 */

const fs = require('fs');
const path = require('path');

const RED = '\x1b[31m', GREEN = '\x1b[32m', BLUE = '\x1b[34m', RESET = '\x1b[0m', BOLD = '\x1b[1m';
let passed = 0, failed = 0;
const failures = [];
function assert(cond, name, details = '') {
    if (cond) { console.log(`  ${GREEN}PASS${RESET} — ${name}`); passed++; }
    else { console.log(`  ${RED}FAIL${RESET} — ${name}${details ? ' | ' + details : ''}`); failed++; failures.push({ name, details }); }
}

console.log(`\n${BOLD}${BLUE}=== E9 ICU / Critical Care Workflow Tests ===${RESET}\n`);

// ===== 1. Static audit — guarded routes + server-side scoring + fail-closed tenant =====
console.log(`${BOLD}[1] Static audit — /api/icu/* guarded (auth+role+tenant) + server-side scoring${RESET}`);
const serverContent = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
const clean = serverContent.replace(/\s+/g, '');

const routeChecks = [
    { p: "app.get('/api/icu/patients',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'GET /api/icu/patients guarded (auth+role+tenant)' },
    { p: "app.post('/api/icu/flowsheet',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'POST /api/icu/flowsheet guarded (auth+role+tenant)' },
    { p: "app.post('/api/icu/monitoring',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'POST /api/icu/monitoring (legacy alias) guarded (auth+role+tenant)' },
    { p: "app.get('/api/icu/flowsheet',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'GET /api/icu/flowsheet guarded (auth+role+tenant)' },
    { p: "app.get('/api/icu/monitoring/:admissionId',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'GET /api/icu/monitoring/:admissionId guarded' },
    { p: "app.post('/api/icu/ventilator',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'POST /api/icu/ventilator guarded (auth+role+tenant)' },
    { p: "app.get('/api/icu/ventilator/:admissionId',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'GET /api/icu/ventilator/:admissionId guarded' },
    { p: "app.post('/api/icu/infusion',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'POST /api/icu/infusion guarded (auth+role+tenant)' },
    { p: "app.get('/api/icu/infusion/:admissionId',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'GET /api/icu/infusion/:admissionId guarded' },
    { p: "app.post('/api/icu/score',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'POST /api/icu/score guarded (auth+role+tenant)' },
    { p: "app.post('/api/icu/scores',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'POST /api/icu/scores (legacy alias) guarded' },
    { p: "app.get('/api/icu/scores/:admissionId',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'GET /api/icu/scores/:admissionId guarded' },
    { p: "app.post('/api/icu/fluid-balance',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'POST /api/icu/fluid-balance guarded (auth+role+tenant)' },
    { p: "app.get('/api/icu/fluid-balance/:admissionId',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'GET /api/icu/fluid-balance/:admissionId guarded' },
    { p: "app.get('/api/icu/board',requireAuth,requireRole('icu','nursing','doctor'),requireTenantScope", l: 'GET /api/icu/board guarded (auth+role+tenant)' }
];
for (const { p, l } of routeChecks) assert(clean.includes(p.replace(/\s+/g, '')), l, p);

assert(clean.includes("functione9RequireTenant(req)") && clean.includes("err.e9Status=403"), 'e9RequireTenant fail-closed helper present (null tenant => 403)');
assert(clean.includes("functione9IntId(v)") && clean.includes("Number.isInteger(n)"), 'e9IntId integer coercion guard present (no padded-id bypass)');
assert(clean.includes("icuScoring.computeICUScores("), 'POST /api/icu/score computes acuity SERVER-SIDE via icuScoring.computeICUScores (anti-spoof)');
assert(clean.includes("functione9LoadActiveIcuAdmission(") && clean.includes("row.status!=='Active'") && clean.includes("E9_ICU_WARD_TYPES.includes(row.ward_type)"), 'e9LoadActiveIcuAdmission validates Active + ICU ward');
assert(clean.includes("E9_ICU_WARD_TYPES=['ICU','NICU','CCU']"), 'ICU ward types defined server-side');
// patient_id derived server-side from admission (not client-trusted) on writes.
assert(clean.includes("adm.id,adm.patient_id"), 'flowsheet/vent/infusion/score stamp server-derived adm.id + adm.patient_id (not client patient_id)');
// audit on sensitive writes.
assert(clean.includes("'ICU_SCORE','ICU'") && clean.includes("'ICU_FLOWSHEET','ICU'") && clean.includes("'ICU_INFUSION','ICU'"), 'sensitive ICU writes call logAudit (flowsheet/score/infusion)');

// ===== 2. Admission-scoping gate re-simulation =====
console.log(`\n${BOLD}[2] Admission-scoping gate (e9LoadActiveIcuAdmission) simulation${RESET}`);

const ICU_WARDS = ['ICU', 'NICU', 'CCU'];
function freshDb() {
    return {
        patients: [{ id: 11, tenant_id: 1 }, { id: 22, tenant_id: 2 }],
        admissions: [
            { id: 101, patient_id: 11, status: 'Active', ward_type: 'ICU', tenant_id: 1 },
            { id: 102, patient_id: 11, status: 'Discharged', ward_type: 'ICU', tenant_id: 1 },
            { id: 103, patient_id: 11, status: 'Active', ward_type: 'General', tenant_id: 1 }, // ward not ICU
            { id: 202, patient_id: 22, status: 'Active', ward_type: 'ICU', tenant_id: 2 }
        ]
    };
}
function e9IntId(v) {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (!Number.isInteger(n) || n <= 0) return null;
    return n;
}
// mirrors server e9LoadActiveIcuAdmission -> returns {status, patient_id?}
function loadAdmission(db, rawId, tenantId) {
    const aid = e9IntId(rawId);
    if (!aid) return { status: 422 };
    const row = db.admissions.find(a => a.id === aid && a.tenant_id === tenantId);
    if (!row) return { status: 404 };
    if (row.status !== 'Active') return { status: 409, reason: 'not-active' };
    if (!ICU_WARDS.includes(row.ward_type)) return { status: 409, reason: 'not-icu' };
    return { status: 200, patient_id: row.patient_id, admission_id: row.id };
}

{
    const db = freshDb();
    assert(loadAdmission(db, 101, 1).status === 200, 'tenant1 writes to own Active ICU admission #101 => 200');
    assert(loadAdmission(db, 101, 1).patient_id === 11, 'patient_id derived server-side from admission (11), not client');
    assert(loadAdmission(db, 202, 1).status === 404, 'tenant1 -> tenant2 admission #202 => 404 (cross-tenant blocked, no leak)');
    assert(loadAdmission(db, 999, 1).status === 404, 'non-existent admission #999 => 404');
    assert(loadAdmission(db, 102, 1).status === 409 && loadAdmission(db, 102, 1).reason === 'not-active', 'Discharged admission #102 => 409 (cannot record ICU data)');
    assert(loadAdmission(db, 103, 1).status === 409 && loadAdmission(db, 103, 1).reason === 'not-icu', 'Active but non-ICU ward admission #103 => 409');
    assert(loadAdmission(db, 0, 1).status === 422, 'id 0 => 422 (invalid)');
    assert(loadAdmission(db, '5x', 1).status === 422, "id '5x' => 422 (non-integer)");
    assert(loadAdmission(db, '0101', 1).status === 200, "padded id '0101' coerces to integer 101 => 200 (numeric, not string-spoof)");
    assert(loadAdmission(db, ' 101 ', 1).status === 200, "whitespace id ' 101 ' coerces to 101 (Number) => 200");
}

// ===== 3. Board acuity-sort re-simulation =====
console.log(`\n${BOLD}[3] ICU board acuity sort (sickest first)${RESET}`);
function buildBoard(rows) {
    // rows: { admission_id, sofa|null, apache|null, gcs|null, on_vent }
    const board = rows.map(p => {
        const sofa = p.sofa, apache = p.apache, gcs = p.gcs;
        const acuity = (sofa !== null ? sofa : -1) * 1000 + (apache !== null ? apache : 0) + (gcs !== null ? (15 - gcs) : 0);
        return { admission_id: p.admission_id, latest_sofa: sofa, acuity };
    });
    board.sort((x, y) => y.acuity - x.acuity);
    return board;
}
{
    const board = buildBoard([
        { admission_id: 1, sofa: 4, apache: 10, gcs: 14, on_vent: false },
        { admission_id: 2, sofa: 16, apache: 30, gcs: 6, on_vent: true },   // sickest
        { admission_id: 3, sofa: 9, apache: 18, gcs: 10, on_vent: true },
        { admission_id: 4, sofa: null, apache: null, gcs: null, on_vent: false } // unscored => after scored
    ]);
    assert(board[0].admission_id === 2, 'board[0] is the highest-SOFA patient (#2, SOFA 16)');
    assert(board[1].admission_id === 3, 'board[1] is the next-sickest (#3, SOFA 9)');
    assert(board[2].admission_id === 1, 'board[2] is the least-sick scored patient (#1, SOFA 4)');
    assert(board[3].admission_id === 4, 'unscored patient (#4) sorts LAST (not treated as low acuity above scored patients)');
    const desc = board.every((b, i) => i === 0 || board[i - 1].acuity >= b.acuity);
    assert(desc, 'board is sorted descending by acuity (sickest first)');
}

console.log(`\n${BOLD}${BLUE}=== E9 ICU Workflow Test Results ===${RESET}`);
console.log(`  ${GREEN}PASS${RESET}: ${passed}   ${RED}FAIL${RESET}: ${failed}`);
if (failed > 0) { failures.forEach(f => console.log(`  - ${f.name}: ${f.details}`)); process.exit(1); }
else { console.log(`\n${GREEN}ALL PASS: ${passed} passed, 0 failed${RESET}\n`); process.exit(0); }
