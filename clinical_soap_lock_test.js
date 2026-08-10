/**
 * clinical_soap_lock_test.js
 * Unit tests for clinical SOAP notes sign, lock, update and amend routes.
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('  PASS', m); } else { fail++; console.log('  FAIL', m); } };

console.log('=== Running SOAP Note Lock & Amendment Unit Tests ===');

const src = fs.readFileSync(path.join(__dirname, 'clinical_cpoe.js'), 'utf8');

// 1. Static checks on code structure
const migrationSrc = fs.readFileSync(path.join(__dirname, 'migrations', 'e1_02_clinical_notes_up.sql'), 'utf8');
ok(src.includes("app.patch('/api/clinical-notes/:id'"), 'PATCH /api/clinical-notes/:id endpoint is registered');
ok(src.includes("app.post('/api/clinical-notes/:id/amend'"), 'POST /api/clinical-notes/:id/amend endpoint is registered');
ok(migrationSrc.includes("chk_clinical_notes_status"), 'clinical_notes status check constraint mentioned in SQL');
ok(src.includes("INSERT INTO emr_amendments"), 'amendment route inserts into emr_amendments');

// 2. Behavioral checks via route handler invocation
(async () => {
    const { mountClinicalRoutes } = require('./clinical_cpoe');
    const cds = require('./cds');

    // Simulated DB
    const notesDB = [
        { id: 10, tenant_id: 1, patient_id: 5, subjective: 'cough', emr_status: 'draft' },
        { id: 20, tenant_id: 1, patient_id: 5, subjective: 'fever', emr_status: 'locked', integrity_hash: 'hash20' },
        { id: 30, tenant_id: 2, patient_id: 6, subjective: 'headache', emr_status: 'draft' }
    ];

    const amendmentsDB = [];
    let auditLogs = [];

    const routes = {};
    const app = {
        post: (p, ...h) => { routes['POST ' + p] = h[h.length - 1]; },
        get: (p, ...h) => { routes['GET ' + p] = h[h.length - 1]; },
        patch: (p, ...h) => { routes['PATCH ' + p] = h[h.length - 1]; }
    };

    const pool = {
        query: async (text, params) => {
            // Find note by ID and tenant
            if (/SELECT.*clinical_notes.*WHERE id=\$1 AND tenant_id=\$2/.test(text) ||
                /SELECT.*clinical_notes.*WHERE id=\$1/.test(text)) {
                const id = params[0];
                const t = params[1];
                let row;
                if (t !== undefined) {
                    row = notesDB.find(n => n.id === id && n.tenant_id === t);
                } else {
                    row = notesDB.find(n => n.id === id);
                }
                return { rows: row ? [row] : [], rowCount: row ? 1 : 0 };
            }
            // Update note
            if (/UPDATE clinical_notes SET/.test(text)) {
                const subjective = params[0];
                const objective = params[1];
                const assessment = params[2];
                const plan = params[3];
                const id = params[4];
                const t = params[5];
                const row = notesDB.find(n => n.id === id && (t === undefined || n.tenant_id === t));
                if (row) {
                    row.subjective = subjective;
                    row.objective = objective;
                    row.assessment = assessment;
                    row.plan = plan;
                }
                return { rowCount: row ? 1 : 0 };
            }
            // Insert amendment
            if (/INSERT INTO emr_amendments/.test(text)) {
                const [record_type, record_id, amended_by_user_id, reason, previous_integrity_hash, new_values_summary] = params;
                amendmentsDB.push({
                    record_type, record_id, amended_by_user_id, reason, previous_integrity_hash, new_values_summary
                });
                return { rowCount: 1 };
            }
            return { rows: [], rowCount: 0 };
        }
    };

    let ctxTenant = 1;
    mountClinicalRoutes(app, {
        pool,
        requireAuth: (req, res, next) => next(),
        requireTenantScope: (req, res, next) => next(),
        getRequestTenantContext: () => ({ tenantId: ctxTenant, facilityId: 1 }),
        logAudit: (uid, name, action, module, msg, ip) => {
            auditLogs.push({ uid, name, action, module, msg, ip });
        },
        requireRole: () => (req, res, next) => next(),
        cds
    });

    function invoke(handler, body, query, params) {
        return new Promise((resolve) => {
            const req = { body: body || {}, query: query || {}, params: params || {}, session: { user: { id: 101, display_name: 'Dr. John', role: 'Doctor' } }, ip: '127.0.0.1' };
            const res = { _code: 200, status(c) { this._code = c; return this; }, json(p) { resolve({ code: this._code, payload: p }); } };
            handler(req, res);
        });
    }

    // Test 1: Edit draft SOAP Note
    ctxTenant = 1;
    const editDraftRes = await invoke(routes['PATCH /api/clinical-notes/:id'], { subjective: 'new cough' }, {}, { id: 10 });
    ok(editDraftRes.code === 200, 'PATCH /api/clinical-notes/:id allows editing draft note');
    ok(notesDB.find(n => n.id === 10).subjective === 'new cough', 'Draft note contents updated in database');

    // Test 2: Reject editing locked SOAP Note
    const editLockedRes = await invoke(routes['PATCH /api/clinical-notes/:id'], { subjective: 'cough' }, {}, { id: 20 });
    ok(editLockedRes.code === 409, 'PATCH /api/clinical-notes/:id rejects editing locked note directly');
    ok(editLockedRes.payload.error_ar.includes('مقفلة'), 'Error message is Arabic-friendly and secure');

    // Test 3: Edit note from another tenant (cross-tenant check)
    const crossTenantRes = await invoke(routes['PATCH /api/clinical-notes/:id'], { subjective: 'cough' }, {}, { id: 30 });
    ok(crossTenantRes.code === 404, 'PATCH /api/clinical-notes/:id enforces tenant isolation (note not found)');

    // Test 4: Create amendment for locked SOAP Note
    const amendRes = await invoke(routes['POST /api/clinical-notes/:id/amend'], {
        reason: 'Typo correction',
        subjective: 'resolved cough'
    }, {}, { id: 20 });
    ok(amendRes.code === 200, 'POST /api/clinical-notes/:id/amend records amendment successfully');
    ok(amendmentsDB.length === 1, 'Amendment recorded in amendments DB table');
    ok(amendmentsDB[0].reason === 'Typo correction', 'Amendment contains correct reason');
    ok(JSON.parse(amendmentsDB[0].new_values_summary).subjective === 'resolved cough', 'Amendment summary logs new values');
    ok(auditLogs.some(l => l.action === 'AMEND_SOAP_NOTE'), 'Amendment audits successfully');

    // Test 5: Reject amendment on draft SOAP Note
    const amendDraftRes = await invoke(routes['POST /api/clinical-notes/:id/amend'], {
        reason: 'Correction',
        subjective: 'cough'
    }, {}, { id: 10 });
    ok(amendDraftRes.code === 409, 'POST /api/clinical-notes/:id/amend rejects amendments on draft notes');

    // Test 6: Reject amendment without reason
    const amendNoReasonRes = await invoke(routes['POST /api/clinical-notes/:id/amend'], {
        subjective: 'cough'
    }, {}, { id: 20 });
    ok(amendNoReasonRes.code === 400, 'POST /api/clinical-notes/:id/amend rejects amendments without a reason');

    if (fail > 0) {
        console.log(`❌ SOAP Note unit tests failed: ${fail} failure(s)`);
        process.exit(1);
    } else {
        console.log(`✅ SOAP Note unit tests passed: ${pass} success(es)`);
        process.exit(0);
    }
})();
