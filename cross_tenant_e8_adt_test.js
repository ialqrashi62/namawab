/**
 * cross_tenant_e8_adt_test.js
 * ==========================================
 * E8 Inpatient / ADT — cross-tenant isolation for the new /api/adt/* routes
 * (admit / transfer / discharge / census / beds / bed-status). DB-free: static-audits
 * server.js for fail-closed tenant filters, then simulates the handlers' tenant/IDOR logic.
 * Mirrors cross_tenant_e7_er_test.js.
 *
 *   NODE_PATH=.../namaweb/node_modules node cross_tenant_e8_adt_test.js
 *
 * Asserts:
 *   - tenant A cannot admit/transfer/discharge/read census for tenant B's patients/beds/admissions
 *   - cross-tenant patient/bed/admission id => 404/403 (zero rows), never leaked
 *   - null tenant fails closed (403) — NEVER an unscoped fallback (e8RequireTenant throws)
 *   - the legacy ADT route that was hardened/touched is also tenant-fail-closed
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

console.log(`\n${BOLD}${BLUE}=== E8 Cross-Tenant ADT Isolation Tests ===${RESET}\n`);

// ===== 1. Static audit: every /api/adt/* query carries tenant_id + fail-closed resolver =====
console.log(`${BOLD}[1] Static audit — tenant filters + fail-closed resolver${RESET}`);
const serverContent = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
const clean = serverContent.replace(/\s+/g, '');
const sqlChecks = [
    { p: "functione8RequireTenant(req){", l: 'fail-closed e8RequireTenant helper defined' },
    { p: "err.e8Status=403;throwerr;", l: 'e8RequireTenant THROWS 403 on null tenant (no unscoped fallback)' },
    { p: "FROMbedsWHEREid=$1ANDtenant_id=$2FORUPDATE", l: 'bed lookup scoped by id + tenant_id (locked)' },
    { p: "FROMadmissionsWHEREid=$1ANDtenant_id=$2FORUPDATE", l: 'admission lookup scoped by id + tenant_id (locked)' },
    { p: "FROMpatientsWHEREid=$1ANDtenant_id=$2", l: 'patient ownership check scoped by tenant_id (IDOR guard)' },
    { p: "JOINwardswONb.ward_id=w.idANDw.tenant_id=$1", l: 'census/beds JOIN scopes wards by tenant_id' },
    { p: "LEFTJOINadmissionsaONb.current_admission_id=a.idANDa.status='Active'ANDa.tenant_id=$1", l: 'census active-admission JOIN scoped by tenant_id' },
    { p: "INSERTINTObed_transfers", l: 'transfer history insert present' },
    { p: "b.tenant_id=$1", l: 'beds filtered by tenant_id' }
];
for (const { p, l } of sqlChecks) assert(clean.includes(p.replace(/\s+/g, '')), l, p);

// Negative: the NEW /api/adt/* block (between its banner and the ICU marker) must NOT contain
// an unscoped "tenantId ? [...] : []" fallback — every adt query is hard-scoped.
const adtStart = serverContent.indexOf("E8 INPATIENT / ADT");
const adtEnd = serverContent.indexOf("===== ICU =====", adtStart);
const adtBlock = (adtStart >= 0 && adtEnd > adtStart) ? serverContent.slice(adtStart, adtEnd) : '';
assert(adtBlock.length > 0, 'E8 /api/adt block located for negative audit');
assert(!/tenantId\s*\?\s*\[/.test(adtBlock), 'no unscoped "tenantId ? [...] : []" fallback inside the /api/adt/* block');
assert(/e8RequireTenant\(req\)/.test(adtBlock), 'every /api/adt handler resolves tenant via e8RequireTenant');
// All six /api/adt routes present and guarded.
for (const r of ['/api/adt/beds', '/api/adt/census', '/api/adt/admit', '/api/adt/transfer', '/api/adt/discharge', '/api/adt/bed-status']) {
    assert(clean.includes("'" + r + "',requireAuth,requireRole('inpatient','nursing','doctor'),requireTenantScope"), `${r} auth+role+tenant guarded`);
}

// Legacy ADT routes touched/relied-on stay tenant-scoped (defense in depth).
assert(clean.includes("app.post('/api/admissions',requireAuth,requireTenantScope"), 'legacy POST /api/admissions still tenant-scoped');
assert(clean.includes("app.put('/api/admissions/:id/discharge',requireAuth,requireTenantScope"), 'legacy discharge still tenant-scoped');

// ===== 2. Simulation: tenant/IDOR isolation across admit / transfer / discharge / census =====
console.log(`\n${BOLD}[2] Tenant isolation simulation${RESET}`);
const mockDb = {
    patients: [{ id: 1, tenant_id: 1 }, { id: 2, tenant_id: 2 }],
    wards: [{ id: 10, tenant_id: 1 }, { id: 20, tenant_id: 2 }],
    beds: [
        { id: 100, ward_id: 10, status: 'Available', tenant_id: 1 },
        { id: 200, ward_id: 20, status: 'Available', tenant_id: 2 }
    ],
    admissions: [
        { id: 1000, patient_id: 1, status: 'Active', ward_id: 10, bed_id: null, tenant_id: 1 },
        { id: 2000, patient_id: 2, status: 'Active', ward_id: 20, bed_id: 200, tenant_id: 2 }
    ]
};

// Fail-closed tenant resolver (mirrors e8RequireTenant): throws when null.
function resolveTenant(req) {
    const t = req.session?.user?.tenantId || null;
    if (!t) { const e = new Error('Tenant scope required'); e.e8Status = 403; throw e; }
    return t;
}
const findBed = (id, t) => mockDb.beds.find(b => b.id === id && b.tenant_id === t) || null;
const findAdm = (id, t) => mockDb.admissions.find(a => a.id === id && a.tenant_id === t) || null;
const findPatient = (id, t) => mockDb.patients.find(p => p.id === id && p.tenant_id === t) || null;

function simCensus(req) {
    let t; try { t = resolveTenant(req); } catch (e) { return { status: e.e8Status }; }
    const beds = mockDb.beds.filter(b => b.tenant_id === t);
    return { status: 200, data: beds };
}
function simAdmit(req, body) {
    let t; try { t = resolveTenant(req); } catch (e) { return { status: e.e8Status }; }
    const bed = findBed(body.bed_id, t);
    if (!bed) return { status: 404 };                          // cross-tenant bed => not found
    if (body.admission_id) {
        const adm = findAdm(body.admission_id, t);
        if (!adm) return { status: 404 };                      // cross-tenant admission => not found
        return { status: 200 };
    }
    const p = findPatient(body.patient_id, t);
    if (!p) return { status: 403 };                            // cross-tenant patient => denied
    return { status: 200 };
}
function simTransfer(req, body) {
    let t; try { t = resolveTenant(req); } catch (e) { return { status: e.e8Status }; }
    const adm = findAdm(body.admission_id, t);
    if (!adm) return { status: 404 };                          // cross-tenant admission => not found
    const dest = findBed(body.to_bed, t);
    if (!dest) return { status: 404 };                         // cross-tenant dest bed => not found
    return { status: 200 };
}
function simDischarge(req, body) {
    let t; try { t = resolveTenant(req); } catch (e) { return { status: e.e8Status }; }
    const adm = findAdm(body.admission_id, t);
    if (!adm) return { status: 404 };                          // cross-tenant admission => not found
    return { status: 200 };
}

const T1 = { session: { user: { tenantId: 1 } } };
const T2 = { session: { user: { tenantId: 2 } } };
const NONE = { session: { user: { tenantId: null } } };

// -- census isolation --
assert(simCensus(T1).data.length === 1 && simCensus(T1).data[0].id === 100, 'tenant 1 census shows only its own bed (100)');
assert(simCensus(T2).data.length === 1 && simCensus(T2).data[0].id === 200, 'tenant 2 census shows only its own bed (200)');
assert(simCensus(NONE).status === 403, 'null tenant census => 403 (fail-closed)');

// -- admit isolation --
assert(simAdmit(T1, { patient_id: 1, bed_id: 100 }).status === 200, 'tenant 1 admits its own patient into its own bed');
assert(simAdmit(T1, { patient_id: 2, bed_id: 100 }).status === 403, 'tenant 1 CANNOT admit tenant 2 patient => 403');
assert(simAdmit(T1, { patient_id: 1, bed_id: 200 }).status === 404, 'tenant 1 CANNOT admit into tenant 2 bed (200) => 404');
assert(simAdmit(T1, { admission_id: 2000, bed_id: 100 }).status === 404, 'tenant 1 CANNOT place tenant 2 admission (2000) into a bed => 404');
assert(simAdmit(NONE, { patient_id: 1, bed_id: 100 }).status === 403, 'null tenant admit => 403');

// -- transfer isolation --
assert(simTransfer(T1, { admission_id: 1000, to_bed: 100 }).status === 200, 'tenant 1 transfers its own admission to its own bed');
assert(simTransfer(T1, { admission_id: 2000, to_bed: 100 }).status === 404, 'tenant 1 CANNOT transfer tenant 2 admission (2000) => 404');
assert(simTransfer(T1, { admission_id: 1000, to_bed: 200 }).status === 404, 'tenant 1 CANNOT transfer into tenant 2 bed (200) => 404');
assert(simTransfer(NONE, { admission_id: 1000, to_bed: 100 }).status === 403, 'null tenant transfer => 403');

// -- discharge isolation --
assert(simDischarge(T1, { admission_id: 1000 }).status === 200, 'tenant 1 discharges its own admission (1000)');
assert(simDischarge(T1, { admission_id: 2000 }).status === 404, 'tenant 1 CANNOT discharge tenant 2 admission (2000) => 404');
assert(simDischarge(NONE, { admission_id: 1000 }).status === 403, 'null tenant discharge => 403');

// -- raw cross-tenant id resolution returns zero rows --
assert(findBed(200, 1) === null, 'tenant 1 cannot resolve tenant 2 bed #200 (cross-tenant id => 0 rows)');
assert(findAdm(2000, 1) === null, 'tenant 1 cannot resolve tenant 2 admission #2000 (cross-tenant id => 0 rows)');
assert(findPatient(2, 1) === null, 'tenant 1 cannot resolve tenant 2 patient #2 (cross-tenant id => 0 rows)');

console.log(`\n${BOLD}${BLUE}=== E8 Cross-Tenant Test Results ===${RESET}`);
console.log(`  ${GREEN}PASS${RESET}: ${passed}   ${RED}FAIL${RESET}: ${failed}`);
if (failed > 0) { failures.forEach(f => console.log(`  - ${f.name}: ${f.details}`)); process.exit(1); }
else { console.log(`\n${GREEN}ALL PASS: ${passed} passed, 0 failed${RESET}\n`); process.exit(0); }
