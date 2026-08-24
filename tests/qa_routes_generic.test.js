// Generic QA: node qa_routes_generic.test.js <moduleSubPath> <expectedCount>
// e.g. node qa_routes_generic.test.js routes/nursing.routes.js 19
const assert = require('assert');
const path = process.argv[2];
const expected = parseInt(process.argv[3], 10);
const factory = require('../' + path.replace(/\\/g, '/'));

const mkRow = () => ({
    rows: [{
        id: 1, cnt: 1, total: 5, ok: true, value: 10, score: 2, band: 'low',
        status: 'Pending', patient_id: 1, tenant_id: 'T9', facility_id: 'F1',
        medication_name: 'X', dosage: '1', quantity: 1, price: 0,
        name: 'X', name_ar: 'س', name_en: 'X', display_name: 'QA',
        email: 'qa@test.local', phone: '0500000000', national_id: '1',
        allergies: '', subjective: '', objective: '', assessment: '', plan: '',
        emr_status: 'draft', role: 'user', user_id: 1,
        stored_path: 'definitely-missing.jpg', original_name: 'x.jpg', encrypted: false, mime_type: 'image/jpeg',
    }],
    rowCount: 1,
});
const mkClient = () => ({ query: async () => mkRow(), release: () => {} });
const deps = {
    // rich row: handlers read many fields off rows[0]; chameleon row avoids undefined-deref noise
    pool: { query: async () => mkRow(), connect: async () => mkClient() },
    requireAuth: (q, s, n) => n(),
    requireRole: () => (q, s, n) => n(),
    requireTenantScope: (q, s, n) => n(),
    validateBody: () => (q, s, n) => n(),
    RS: new Proxy({}, { get: () => ({}) }),
    getRequestTenantContext: () => ({ tenantId: 'T9', facilityId: 'F1' }),
    calcVAT: async () => ({ rate: 0.15, vatAmount: 0, applyVAT: true }),
    addVAT: (a, r) => ({ total: a * (1 + r), vatAmount: a * r }),
    logAudit: () => {},
    sendLabResultNotification: async () => {},
    sendRadiologyResultNotification: async () => {},
    sendDoctorSMS: async () => {},
    sendPatientEmail: async () => {},
    sendDoctorEmail: async () => {},
    sendBillingError: () => {},
    smsService: { sendSMS: async () => true },
    emailService: { sendEmail: async () => true },
    tenantStore: { get: () => null },
    initDatabase: async () => {},
    auditAllMutations: false,
    // universal service mocks: any method call returns a chameleon value
    nursingScores: universal('computePainBand'),
    specialtyScores: universal('parseOptionalInt'),
    lis: universal('autoVerify'),
    lisRequireTenant: () => ({ tenantId: 'T9', facilityId: 'F1' }),
    resultLoop: universal('enqueue'),
    e18: universal('e18IntId'),
    e18RequireTenant: () => ({ tenantId: 'T9' }),
    e18BeginTenantTx: async () => ({ query: async () => ({ rows: [{ id: 1 }], rowCount: 1 }) }),
    optionalReadFallback: () => false,
    getPatientActiveMeds: async () => [{ id: 1 }],
    withPharmacyTx: async (t, fn) => fn({ query: async () => ({ rows: [{ id: 1 }], rowCount: 1 }) }),
    E10_ACCOUNT_CLASSES: ['Asset', 'Liability', 'Equity'],
    e10Err: (res) => res.status(500),
    e10IntId: (v) => parseInt(v, 10) || null,
    e10PostingEnabled: () => true,
    e10RequireTenant: () => ({ tenantId: 'T9' }),
    e10ZatcaEnabled: () => false,
    ensureCOAAccount: async () => ({ id: 1 }),
    idempotencyGuard: async (req, res) => true,
    postTransactionToGL: async () => ({ id: 1 }),
    fe: universal('validateBalancedEntry'),
    e9IntId: (v) => parseInt(v, 10) || null,
    e9RequireTenant: () => ({ tenantId: 'T9' }),
    e9LoadActiveIcuAdmission: async () => ({ id: 1 }),
    e9PostFlowsheet: async () => ({ id: 1 }),
    e9PostScore: async () => ({ id: 1 }),
    icuScoring: universal('computeSOFA'),
    ce: universal('encrypt'),
    upload: { single: () => (q, s, n) => n(), array: () => (q, s, n) => n(), fields: () => (q, s, n) => n() },
    isOptionalReadSchemaError: () => false,
    RAD_MWL_ENABLED: false,
    RAD_WORKLIST_NEXT: {},
    RAD_WORKLIST_STATES: ['Scheduled', 'InProgress', 'Completed'],
    e14IntId: (v) => parseInt(v, 10) || null,
    e14PatientInTenant: async () => true,
    e14PregnancyInTenant: async () => true,
    e14RequireTenant: () => ({ tenantId: 'T9' }),
    OB_RBAC: universal('assert'),
    obEngine: universal('compute'),
    E11_INS_ROLES: ['finance', 'accounts'],
    e11Engine: universal('submitClaim'),
    e11Err: (res) => res.status(500),
    e11IntId: (v) => parseInt(v, 10) || null,
    e11Money: (v) => parseFloat(v) || 0,
    e11NphiesEnabled: () => false,
    e11RequireTenant: () => ({ tenantId: 'T9' }),
    e17RequireTenant: () => ({ tenantId: 'T9' }),
    E17_AMS_SEVERITY: ['low', 'moderate', 'high'],
    E17_PRECAUTION_TYPES: ['contact', 'droplet', 'airborne'],
    checkAndTriggerAutoReorder: async () => [],
    e16: universal('computeStock'),
    e16BeginTenantTx: async () => ({ query: async () => ({ rows: [{ id: 1 }], rowCount: 1 }) }),
    e16RequireTenant: () => ({ tenantId: 'T9' }),
    e17CanSeeConfidential: () => true,
    e17ComputeRisk: () => ({ score: 4, level: 'moderate' }),
    e17IsValidCapaTransition: () => true,
    e17IsValidIncidentTransition: () => true,
    E17_CAPA_TYPES: ['corrective'],
    E17_INCIDENT_HARM: ['none', 'minor', 'major'],
    E17_INCIDENT_SEVERITY: ['low', 'high'],
    E17_INCIDENT_TYPES: ['clinical'],
    bcrypt: { hash: async () => '$2a$10$hash', compare: async () => true, genSalt: async () => '$2a$10$salt' },
    ROLE_PERMISSIONS: { Admin: ['*'] },
    userLimitGuard: (q, s, n) => n(),
    requireTenantContext: (q, s, n) => n(),
    requireTenantAdmin: (opts) => (q, s, n) => n(),
    createSystemUserWithTenantLink: async () => ({ id: 1 }),
    validatePasswordPolicy: () => ({ ok: true }),
    BB_NEAR_EXPIRY_DAYS: 7,
    BB_VALID_COMPONENTS: ['PRBC', 'FFP', 'PLT'],
    bbCompat: universal('checkCompatibility'),
    e13RequireTenant: () => ({ tenantId: 'T9' }),
    e13Respond: (res, code, body) => res.status(code).json(body || { success: true }),
    pathologyEngine: universal('compute'),
    E12_WHO_ORDER: ['Surgeon', 'Assistant', 'Anesthesiologist', 'Scrub Nurse', 'Circulating Nurse'],
    e12IsValidSurgeryTransition: () => true,
    e12NormalizeStatus: (s) => s,
    E12_WHO_PHASE_TO_STATE: { 'time-out': 'InProgress' },
    e12IntId: (v) => parseInt(v, 10) || null,
    e12LoadSurgery: async () => ({ id: 1, status: 'Scheduled' }),
    e12RequireTenant: () => ({ tenantId: 'T9' }),
    e12WhoNextState: (phase) => 'InProgress',
    requirePermission: (perm) => (q, s, n) => n(),
    e8RequireTenant: () => ({ tenantId: 'T9' }),
    e7RequireTenant: () => ({ tenantId: 'T9' }),
    smsService: universal('sendSMS'),
    sendPatientEmail: async () => ({ sent: true }),
    crypto: require('crypto'),
    ZATCA_CREDIT_REASON_CODES: ['01', '02', '03'],
    sendBillingError: (res, code, msg) => res.status(code || 500).json({ error: msg || 'billing error' }),
    E8_ADMISSION_TERMINAL: ['DISCHARGED'],
    E8_BED_FREE_STATES: ['FREE'],
    E8_BED_STATUSES: ['FREE', 'OCCUPIED', 'MAINTENANCE'],
    e8CanTransitionBed: () => true,
    e8IntId: (v) => parseInt(v, 10) || null,
    canViewAdminAuditTrail: () => true,
    activeUserSessions: new Map(),
    ce: universal('encrypt'),
    establishSession: universal('establishSession'),
    loginLimiter: Object.assign((req, res, next) => next(), { consume: async () => true, resetKey: async () => true, reset: async () => true }),
    mfaConsume: async () => ({ ok: true }),
    requireCatalogAccess: (q, s, n) => n(),
    mfaGenSecret: async () => ({ secret: 'SECRET', otpauth_url: 'otpauth://x' }),
    mfaVerify: (secret, token) => true,
    ER_DISPOSITIONS: ['ADMITTED', 'DISCHARGED', 'TRANSFERRED'],
    esiEngine: universal('computeESI'),
    paymentAdapter: universal('charge'),
    canReviewOvr: () => true,
    EMPLOYEE_DIRECTORY_COLS: ['id', 'name'],
    isHrOrAdmin: (a, b, c) => (typeof c === 'function' ? c() : true),
    assignTenantPlanHelper: async () => ({ plan: 'PRO' }),
    auditResultAckFallback: async () => {},
    resultAckTableExists: async () => true,
    centerPatient360: async () => ({ id: 1, centers: [] }),
    ewsEngine: universal('computeEWS'),
    isHighAlertMed: () => true,
    MAR_TIME_WINDOW_MIN: 30,
    marNorm: universal('normalize'),
    corsAllowlist: ['http://localhost'],
    corsOptions: {},
    cspReportLimiter: (q, s, n) => n(),
    rateLimit: () => (q, s, n) => n(),
    cors: () => (q, s, n) => n(),
    app: { locals: {} },
    isHimOrAdmin: (a, b, c) => (typeof c === 'function' ? c() : true),
    _himPushSource: async (events, sql, params, map) => { try { const r = (await deps.pool.query(sql, params)).rows[0]; if (r && map) events.push(map(r)); } catch (e) {} },
    cds: universal('triage'),
    _aiOrch: () => universal('run'),
    _aiWrap: (name, fn) => fn,
    AI_ORCH_ROLE: (q, s, n) => n(),
};
function makeUniversal() {
    const UNIV = new Proxy(function () {}, {
        get: (t, p) => {
            if (p === 'ok') return true;
            if (p === Symbol.toPrimitive) return () => 1;
            if (p === 'length') return 1;
            if (p === 'then') return undefined;
            return UNIV;
        },
        apply: () => UNIV,
    });
    return new Proxy({}, { get: () => (...a) => UNIV });
}
function universal(name) { return makeUniversal(); }

const router = factory(deps);

(async () => {
    // 1. contract
    const n = router.stack.length;
    assert.ok(expected ? n === expected : n > 0, `route count ${n} != ${expected}`);

    // 2. runtime: every final handler executes without ReferenceError/500
    let ran = 0;
    for (const layer of router.stack) {
        const handle = layer.route.stack[layer.route.stack.length - 1].handle;
        let status = 200;
        const res = { json: () => {}, send: () => {}, status: (s) => { status = s; return res; }, end: () => {} };
        await handle({ query: {}, params: { id: '1', patientId: '1' }, body: {}, session: { user: { id: 1, display_name: 'QA', name: 'QA' }, destroy: (cb) => cb && cb(), regenerate: (cb) => cb && cb(), save: async () => {}, reload: async () => {} }, ip: '127.0.0.1', headers: {} }, res, () => {});
        if (status === 500) {
            // auto-trace: rebuild router with logging deps, rerun this handler, print last dep calls
            const log = [];
            const tDeps = {};
            for (const k of Object.keys(deps)) {
                if (typeof deps[k] === 'function') {
                    tDeps[k] = (...a) => { log.push(k); return deps[k](...a); };
                } else if (deps[k] && typeof deps[k] === 'object') {
                    tDeps[k] = new Proxy(deps[k], { get: (t, p) => { log.push(`${k}.${String(p)}`); return t[p]; } });
                } else {
                    tDeps[k] = deps[k];
                }
            }
            const r2 = factory(tDeps);
            const l2 = r2.stack.find(x => x.route.path === layer.route.path && x.route.methods[Object.keys(layer.route.methods)[0]]);
            const h2 = l2.route.stack[l2.route.stack.length - 1].handle;
            const res2 = { json: () => {}, send: () => {}, status: () => res2, end: () => {} };
            try { await h2({ query: {}, params: { id: '1', patientId: '1' }, body: {}, session: { user: { id: 1, display_name: 'QA', name: 'QA' }, destroy: (cb) => cb && cb(), regenerate: (cb) => cb && cb(), save: async () => {}, reload: async () => {} }, ip: '127.0.0.1', headers: {} }, res2, () => {}); } catch (e) { console.error('UNCAUGHT:', e.message); }
            assert.fail(`500 at ${Object.keys(layer.route.methods)[0]} ${layer.route.path} | last deps: ${log.slice(-6).join(' -> ')}`);
        }
        ran++;
    }

    // 3. middleware chains intact
    assert.ok(router.stack.every(l => l.route.stack.length >= 1));
    console.log(`QA PASS [${path}]: contract(${n}), runtime(${ran}/${ran}), middleware`);
})().catch(e => { console.error('QA FAIL:', e.message); process.exit(1); });
