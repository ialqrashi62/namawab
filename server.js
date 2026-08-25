require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { pool, initDatabase, tenantStore } = require('./db_postgres');
const bcrypt = require('bcryptjs');
const smsService = require('./sms_service');
const emailService = require('./email_service');
const ce = require('./crypto_envelope'); // A3 at-rest envelope encryption (DPAPI KEK); graceful when not configured
const crypto = require('crypto'); // hoisted: referenced by early route mounts
const lis = require('./lis'); // E3 LIS clinical-safety core (autoVerify / isCritical / HL7 parse / QC) — pure functions
const fe = require('./finance_engine'); // E10 GL/ZATCA pure engine (balanced-entry, VAT, aging, UBL/QR)
const bbCompat = require('./bloodbank_compat'); // E13 blood-bank ABO/Rh compatibility engine (pure, fail-closed)
const obEngine = require('./ob_engine'); // E14 OB/Maternity server-side authority engine (EDD/GA/GPAL/APGAR/biometry/risk)
const { insertSampleData, populateLabCatalog, populateRadiologyCatalog } = require('./seed_data_pg');
const { populateMedicalServices, populateBaseDrugs } = require('./seed_services_pg');
const { addExtraLabTests, addExtraRadiology } = require('./seed_extra_catalog');
const { mountOrderRoutes } = require('./orders');           // E-X1 unified orders (additive)
const { makeRequirePermission } = require('./rbac');        // E-X3 RBAC matrix middleware (additive)
const { makeAuditMiddleware } = require('./audit_middleware'); // GATE3-M1 auto audit (inert unless AUDIT_ALL_MUTATIONS=true)
const { validateBody } = require('./validation');           // GATE3-H1 central input validation (fail-closed, 400)
const RS = require('./route_schemas');                      // accurate non-breaking schemas for key routes
const { validatePasswordPolicy } = require('./password_policy');
// E1 Doctor Station (additive): pure CDS engine + clinical routes (problems/SOAP/CPOE).
const cds = require('./cds');
// ===== Phase 3 Week Bundle: AI Orchestrators + LangChain shim + clinical prompts =====
// Monkey-patch `langchain.LangChain.execute` so the 13 ai_*_orchestrator.js files
// (cardiology, critical, derm, diagnostics, endocrine, gastro, infectious, nephrology,
// obgyn_peds, oncology, pulmonology, rheuma, surgery) can use the LLMClient when keys
// are configured and a deterministic RAG-grounded fallback otherwise. No behavior change
// at runtime when LLM_API_KEY is unset — orchestrators remain callable.
try {
    const langchain = require('langchain');
    const shim = require('./ai_langchain_shim');
    langchain.LangChain = shim.LangChain;
} catch (e) {
    console.warn('[AI] langchain shim not applied:', e.message);
}
const aiLangChainShim = require('./ai_langchain_shim');
const { mountClinicalRoutes } = require('./clinical_cpoe');
// E6 Nursing / MAR (additive): pure clinical-scoring engine (Morse/Braden/NEWS/Pain).
const nursingScores = require('./nursing_scores');
// E7 Emergency Department (additive): server-side ESI (Emergency Severity Index) triage engine.
const esiEngine = require('./esi_engine');
// E9 ICU / Critical Care (additive): server-side, anti-spoof SOFA / GCS / APACHE-II acuity engine.
const icuScoring = require('./icu_scoring');
// Gate 1 (specialty modules): server-side, anti-spoof GCS / DAS28 / NIHSS score engine.
const specialtyScores = require('./specialty_scores');
// Gate 2: server-side early-warning + sepsis screening engine (MEWS/PEWS/qSOFA/SIRS + escalation).
const ewsEngine = require('./ews_engine');
// Gate 3: order↔result closed-loop + acknowledgement policy engine.
const resultLoop = require('./result_loop');
// Gate 4: tenant-context resolution (session precedence over x-tenant-id header, anti-spoof).
const { resolveTenantContext } = require('./tenant_resolve');
// Gate 7: opt-in, fail-open idempotency guard for money/claim-mutating routes.
const { makeIdempotencyGuard } = require('./idempotency');
const e11Engine = require('./e11_insurance_engine'); // E11 insurance/NPHIES pure engine (state machines + co-pay math)
const pathologyEngine = require('./pathology_engine'); // E15: pure state-machine + accession + flag engine
const e16 = require('./e16_inventory_engine'); // E16 inventory/CSSD pure engine (FEFO, no-negative, BI gate)
const e18 = require('./e18_hr_engine'); // E18 HR/Workforce pure engine (license expiry, leave SM, payroll, PII mask)
const { mountOnboardingRoutes } = require('./onboarding'); // E0 Facility Onboarding Wizard (super-admin provisioning)
const paymentAdapter = require('./payment_adapter');


// Multer setup for radiology image uploads — A3A: PHI vault OUTSIDE public webroot (no static/direct access)
const uploadsDir = path.join(__dirname, 'phi_vault', 'radiology');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadsDir),
        filename: (req, file, cb) => {
            // L-2: build the stored name from a sanitized (digits-only) id, never the raw param, and
            // store a lowercased extension. The route re-validates :id against the DB afterwards.
            const safeId = String(req.params.id || '').replace(/[^0-9]/g, '').slice(0, 12) || 'x';
            cb(null, `rad_${safeId}_${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
        }
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        // M-1: ANCHORED extension allowlist (so '.webpage' cannot match 'webp') AND a mimetype allowlist.
        // (Stored files are outside the webroot and served with a pinned MIME + nosniff + sandbox CSP.)
        const extOk = /^\.(jpe?g|png|gif|bmp|webp|dicom|dcm)$/.test(path.extname(file.originalname).toLowerCase());
        const mimeOk = /^(image\/(jpeg|png|gif|bmp|webp)|application\/dicom|application\/octet-stream)$/.test(String(file.mimetype || '').toLowerCase());
        cb(null, extOk && mimeOk);
    }
});

const compression = require('compression');
const app = express();
app.set('trust proxy', 1);
app.use(compression());
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));

// ===== Gate 3: HTTP perimeter hardening (CODE-ONLY; activates on next PM2 restart) =====
// CORS allowlist: the SPA is same-origin and needs NO cross-origin CORS. Same-origin requests
// carry no Origin (or a matching one) and never require ACAO. Set CORS_ALLOWED_ORIGINS
// (comma-separated) only if a trusted cross-origin client must call the API with credentials.
const corsAllowlist = (process.env.CORS_ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
// Extra headers not covered by helmet defaults: Permissions-Policy + CSP.
// CSP mode is controlled by CSP_ENFORCE (default unset -> Report-Only). Enforcing stays OFF until a
// separate approved deploy sets CSP_ENFORCE=true: the SPA still relies on inline handlers/styles + CDN
// assets, so observe report-uri violations first. img-src/media-src cover the login page's external
// avatar (googleusercontent) + promo video (cloudinary); report-uri points at the sanitized collector below.
const CSP_ENFORCE = process.env.CSP_ENFORCE === 'true';   // default false => Content-Security-Policy-Report-Only
const CSP_DIRECTIVES = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://lh3.googleusercontent.com",
    "media-src 'self' https://res.cloudinary.com",
    "connect-src 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "report-uri /api/csp-report"
].join('; ');
app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()');
    res.setHeader(CSP_ENFORCE ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only', CSP_DIRECTIVES);
    next();
});

// CSP violation report collector (sanitized, PHI-free, no DB). Registered BEFORE session/CSRF so the
// browser's unauthenticated report POST is always accepted. Logs a truncated summary only — never
// cookies, Authorization, body, or PHI. Rate-limited to bound log volume.
const cspReportLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: false, legacyHeaders: false });
// ===== /API/CSP-REPORT (extracted -> routes/csp-report.routes.js; behavior-preserving) =====
// ===== hoisted const defs referenced by earlier route mounts (auto-relocated) =====
const E12_WHO_ORDER = ['Not Started', 'Sign-In', 'Time-Out', 'Sign-Out', 'Completed'];
const ZATCA_CREDIT_REASON_CODES = {
    'CANCEL': 'Cancellation of invoice',
    'RETURN': 'Return of goods/services',
    'DISCOUNT': 'Discount adjustment',
    'ERROR': 'Correction of billing error',
    'OVERPAY': 'Overpayment correction'
};

app.use(require('./routes/csp-report.routes.js')({ cspReportLimiter }));

// Rate limiting for login endpoint
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many login attempts, please try again after 15 minutes' } });

// Middleware — CORS restricted to an allowlist (no more reflect-any-origin with credentials).
app.use(cors({
    origin: function (origin, cb) {
        if (!origin) return cb(null, true);             // same-origin / non-browser (no Origin header)
        if (corsAllowlist.includes(origin)) return cb(null, true);
        return cb(null, false);                         // disallowed cross-origin: no ACAO emitted -> browser blocks
    },
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
class FallbackSessionStore extends session.Store {
    constructor(redisStore) {
        super();
        this.redisStore = redisStore;
        this.memoryStore = new session.MemoryStore();
        
        if (typeof redisStore.on === 'function') {
            redisStore.on('disconnect', (...args) => this.emit('disconnect', ...args));
            redisStore.on('connect', (...args) => this.emit('connect', ...args));
        }
    }
    get(sid, cb) {
        if (this.redisStore.client.isReady) {
            this.redisStore.get(sid, (err, val) => {
                if (err) {
                    console.warn('[SESSION WARNING] Redis get failed, falling back to MemoryStore:', err.message);
                    return this.memoryStore.get(sid, cb);
                }
                cb(null, val);
            });
        } else {
            this.memoryStore.get(sid, cb);
        }
    }
    set(sid, val, cb) {
        if (this.redisStore.client.isReady) {
            this.redisStore.set(sid, val, (err) => {
                if (err) {
                    console.warn('[SESSION WARNING] Redis set failed, falling back to MemoryStore:', err.message);
                    return this.memoryStore.set(sid, val, cb);
                }
                cb(null);
            });
        } else {
            this.memoryStore.set(sid, val, cb);
        }
    }
    destroy(sid, cb) {
        if (this.redisStore.client.isReady) {
            this.redisStore.destroy(sid, (err) => {
                if (err) {
                    console.warn('[SESSION WARNING] Redis destroy failed, falling back to MemoryStore:', err.message);
                    return this.memoryStore.destroy(sid, cb);
                }
                cb(null);
            });
        } else {
            this.memoryStore.destroy(sid, cb);
        }
    }
    touch(sid, val, cb) {
        if (this.redisStore.client.isReady) {
            if (typeof this.redisStore.touch === 'function') {
                this.redisStore.touch(sid, val, (err) => {
                    if (err) return this.memoryStore.touch(sid, val, cb);
                    cb(null);
                });
            } else {
                cb(null);
            }
        } else {
            this.memoryStore.touch(sid, val, cb);
        }
    }
}

// Redis Session Store Setup with graceful Fallback
let sessionStore;
if (process.env.REDIS_URL || process.env.REDIS_HOST) {
    try {
        const { createClient } = require('redis');
        const { RedisStore } = require('connect-redis');
        const redisClient = createClient({
            url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
        });
        redisClient.on('error', (err) => {
            console.warn('[REDIS WARNING] Could not connect to Redis, session store falling back to MemoryStore:', err.message);
        });
        redisClient.connect().then(() => {
            console.log('[REDIS SUCCESS] Connected to Redis successfully for distributed sessions.');
        }).catch(err => {
            console.warn('[REDIS WARNING] Failed to connect to Redis server, falling back to MemoryStore:', err.message);
        });
        const store = new RedisStore({ client: redisClient, prefix: "nama_session:" });
        sessionStore = new FallbackSessionStore(store);
        // Expose for /api/health diagnostics (no-op if Redis is down)
        if (!app.locals.redisClient) app.locals.redisClient = redisClient;
    } catch (e) {
        console.warn('[SESSION WARNING] Redis dependencies or connection failed, falling back to MemoryStore:', e.message);
    }
} else {
    console.log('[SESSION INFO] No Redis configuration detected, using default MemoryStore for sessions.');
}

const sessionConfig = {
    secret: process.env.SESSION_SECRET || (process.env.NODE_ENV === 'production' ? (() => { throw new Error('SESSION_SECRET is required in production'); })() : 'dev-only-insecure-secret-change-me'),
    // resave:false — the session store (Redis via connect-redis / FallbackSessionStore) implements touch(),
    // so rolling TTL is preserved without rewriting unchanged sessions on every request (avoids write churn
    // and a lost-update race between concurrent requests). OWASP session-management best practice.
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 8 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' && process.env.PUBLIC_STAGING_HTTP_ONLY !== 'true',
        sameSite: 'lax'
    },
    rolling: true
};

if (sessionStore) {
    sessionConfig.store = sessionStore;
}

app.use(session(sessionConfig));

// ===== Gate 3: CSRF defense-in-depth — Origin/Referer check for state-changing requests =====
// Complements sameSite=lax cookies. Conservative & reversible: safe methods pass; missing Origin
// (non-browser clients, health checks) passes (auth + sameSite still apply); same-origin always
// passes; cross-origin mutations are blocked unless the Origin is in CORS_ALLOWED_ORIGINS.
const CSRF_SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
app.use((req, res, next) => {
    if (CSRF_SAFE_METHODS.has(req.method)) return next();
    const origin = req.get('origin');
    if (!origin) return next();
    try {
        if (new URL(origin).host === req.get('host')) return next();   // same-origin
    } catch (e) { /* malformed Origin -> fall through to block */ }
    if (corsAllowlist.includes(origin)) return next();                 // explicitly trusted cross-origin
    return res.status(403).json({ error: 'Cross-origin request blocked' });
});

// ===== Global API rate limiter (defense-in-depth; OWASP ASVS V11). =====
// OFF by default (RATE_LIMIT_GLOBAL unset) -> ZERO behavior change. Enable on staging first, then prod.
// When on, caps per-IP volume on /api/* ; the login + csp-report routes keep their own stricter limits.
if (process.env.RATE_LIMIT_GLOBAL === 'true') {
    const globalApiLimiter = rateLimit({
        windowMs: 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_GLOBAL_MAX) || 600,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many requests, please slow down.' }
    });
    app.use('/api', globalApiLimiter);
    console.log(`[RATE-LIMIT] Global /api limiter ENABLED (${process.env.RATE_LIMIT_GLOBAL_MAX || 600}/min per IP)`);
}

// ===== TENANT CONTEXT MIDDLEWARE (RLS wiring, ported from 10ded01) =====
// Binds the request's tenant (from trusted session via getRequestTenantContext) into
// AsyncLocalStorage so the patched pool.query sets app.tenant_id on the DB connection before
// any RLS-protected query. No tenant context (unauthenticated/public) -> passthrough; protected
// routes still gate via requireTenantScope. Per-request, no cross-request leak.
app.use((req, res, next) => {
    const { tenantId, facilityId } = getRequestTenantContext(req);
    if (tenantId) {
        tenantStore.run({ tenantId, facilityId }, () => next());
    } else {
        next();
    }
});

// A3A: hard-deny legacy public PHI paths BEFORE static/SPA fallback (PHI now served only via /api/phi-files/:id)
app.all('/uploads/radiology/*', (req, res) => res.status(404).json({ error: 'Not found' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// ===== extracted helpers (Phase 2 pass A: pure) =====
const { requireAuth, requireCatalogAccess, sendBillingError } = require('./lib/guards');
const { isHrOrAdmin, normalizeRoleName, hasAnyRole, canReviewOvr, canViewAdminAuditTrail, e17CanSeeConfidential, isHimOrAdmin } = require('./lib/roles');
const { getRequestTenantContext, requireTenantScope, requireTenantContext, requireFacilityContext, withTenantFilter, e17RequireTenant, e11RequireTenant, lisRequireTenant, e10RequireTenant, e12RequireTenant, e13RequireTenant, e13Respond, e7RequireTenant, e8RequireTenant, e9RequireTenant, e18RequireTenant, e14RequireTenant } = require('./lib/tenant-context');
const { isOptionalReadSchemaError, optionalReadFallback } = require('./lib/read-fallback');
const { mfaB32Encode, mfaB32Decode, mfaGenSecret, mfaCodeAt, mfaVerify, mfaMatchCounter, mfaConsume } = require('./lib/mfa');
const { e17IsValidIncidentTransition, e17IsValidCapaTransition, e17ComputeRisk, e11IntId, e11Money, e11Err, e11NphiesEnabled, e10PostingEnabled, e10ZatcaEnabled, e10IntId, e10Err, e12IntId, e12NormalizeStatus, e12IsValidSurgeryTransition, e12WhoNextState, e8CanTransitionBed, e8IntId, e9IntId, e14IntId, isHighAlertMed, marNorm } = require('./lib/domain-utils');

// ===== CATALOG EDIT RESTRICTION (Admin/Manager only) =====

// ===== DISCOUNT LIMIT BY ROLE + server-side billing integrity (PHASE 1 C-2/C-3) =====
// Pure, unit-tested helpers live in ./billing_integrity.js (parseMoney / enforceDiscountCap fail closed).
const { MAX_DISCOUNT_BY_ROLE, parseMoney, enforceDiscountCap, parsePositiveMoneyToMinorUnits, toMinorUnits, assertAmountWithinCap } = require('./billing_integrity');

// sendBillingError: translate a thrown integrity error into its HTTP status (defaults to 500 for unexpected errors).

// RBAC middleware - role-based access control
const ROLE_PERMISSIONS = {
    'Admin': '*',
    'Doctor': ['dashboard', 'patients', 'appointments', 'doctor', 'lab', 'radiology', 'pharmacy', 'nursing', 'waiting', 'reports', 'messaging', 'surgery', 'consent', 'icu', 'him', 'medical-records', 'emergency', 'inpatient', 'bloodbank', 'obgyn', 'antenatal', 'cssd', 'quality', 'infection', 'transport', 'telemedicine', 'cme'],
    'Nurse': ['dashboard', 'patients', 'nursing', 'waiting', 'vitals', 'icu', 'emergency', 'inpatient', 'transport', 'dietary', 'bloodbank', 'obgyn', 'antenatal', 'cssd', 'quality', 'infection', 'telemedicine', 'cme'],
    'HIM': ['dashboard', 'patients', 'him', 'medical-records', 'reports', 'messaging'],
    'OB/GYN': ['dashboard', 'patients', 'doctor', 'lab', 'radiology', 'surgery', 'nursing', 'inpatient', 'obgyn', 'antenatal', 'messaging', 'reports', 'transport', 'telemedicine', 'cme'],
    'Midwife': ['dashboard', 'patients', 'nursing', 'obgyn', 'antenatal', 'messaging', 'cme'],
    'Neonatologist': ['dashboard', 'patients', 'icu', 'nursing', 'obgyn', 'antenatal', 'messaging', 'transport', 'telemedicine', 'cme'],
    'Pharmacist': ['dashboard', 'pharmacy', 'inventory', 'messaging', 'infection'],
    'Lab Technician': ['dashboard', 'lab', 'messaging', 'bloodbank'],
    'Blood Bank': ['dashboard', 'bloodbank', 'messaging'],
    'CSSD Manager': ['dashboard', 'cssd', 'inventory', 'messaging'],
    'Inventory Manager': ['dashboard', 'inventory', 'messaging'],
    'Radiologist': ['dashboard', 'radiology', 'messaging'],
    'Pathologist': ['dashboard', 'pathology', 'lab', 'messaging'],
    'Reception': ['dashboard', 'patients', 'appointments', 'waiting', 'messaging', 'accounts', 'transport', 'telemedicine'],
    'Finance': ['dashboard', 'finance', 'insurance', 'reports', 'accounts', 'invoices'],
    'Insurance': ['dashboard', 'insurance', 'reports'],
    'HR': ['dashboard', 'hr', 'messaging', 'reports', 'cme'],
    'IT': ['dashboard', 'settings', 'messaging', 'maintenance'],
    'Quality Manager': ['dashboard', 'quality', 'infection', 'reports', 'messaging'],
    'Infection Control': ['dashboard', 'infection', 'quality', 'nursing', 'reports', 'messaging'],
    'Staff': ['dashboard', 'messaging']
};
// ===== extracted pool-bound helpers (Phase 2 pass B: factory DI) =====
const { logAudit } = require('./lib/pool-fns/audit')({ pool });
const { requireRole, establishSession } = require('./lib/pool-fns/auth-session')({ pool, logAudit });
const { resultAckTableExists, resultAckAuditKey, auditResultAckExists, auditResultAckFallback } = require('./lib/pool-fns/results-audit')({ pool, logAudit });
const { centerPatient360 } = require('./lib/pool-fns/patient360')({ pool });
const { e9LoadActiveIcuAdmission, e9PostFlowsheet, e9PostScore } = require('./lib/pool-fns/icu')({ pool, logAudit });
const { e12LoadSurgery, _himPushSource } = require('./lib/pool-fns/misc')({ pool });
const { _aiWrap, _aiOrch } = require('./lib/pool-fns/ai-wrap')({ logAudit });

// H-7: HR or Admin may see compensation fields; everyone else gets a safe staff-directory projection.





// directory-safe employee columns (excludes salary / commission_type / commission_value)
const EMPLOYEE_DIRECTORY_COLS = 'id, name, name_ar, name_en, role, department_ar, department_en, status, created_at';

// Audit trail helper

// ===== SaaS Batch 2: unified Auth/RBAC guards (one tested source of truth; behavior-preserving) =====
// requireTenantAdmin replaces duplicated inline `role !== 'Admin'` checks (same 403 + same audit events
// via per-route action/module). requireSuperAdmin reuses super_admin.isSuperAdmin (single identity source).
const { makeGuards } = require('./rbac_guards');
const { requireTenantAdmin, requireSuperAdmin } = makeGuards({ logAudit });

// ===== SaaS Batch 4C: max_users enforcement candidate (single point, flag-gated) =====
// No-op unless ENTITLEMENTS_ENABLED=true (zero queries / zero behavior change otherwise). observe logs only;
// enforce blocks user creation at the plan limit. Fail-open on any resolver/count error. NOT activated live.
const { makeUserLimitGuard } = require('./entitlements');
const userLimitGuard = makeUserLimitGuard({ pool, logAudit, getActor: (req) => req.session && req.session.user });
// Batch 4D: atomic user creation + tenant linkage (closes the max_users count gap).
const { createSystemUserWithTenantLink } = require('./user_provisioning');

// ===== GATE3-M1: automatic audit logging for /api mutations (INERT unless AUDIT_ALL_MUTATIONS=true) =====
// Complements the explicit logAudit() calls. Default OFF -> zero behavior change until enabled on staging.
// Logs AFTER the response (never blocks), records only method/path/status/user/ip (no body, no PHI).
app.use(makeAuditMiddleware({
    logAudit,
    getTenantId: (req) => getRequestTenantContext(req).tenantId,
    runWithTenant: (tenantId, fn) => tenantStore.run({ tenantId }, fn)   // bind app.tenant_id so audit row is tenant-tagged
}));
if (process.env.AUDIT_ALL_MUTATIONS === 'true') console.log('[AUDIT] Auto-audit of /api mutations ENABLED');

// ===== TENANT ISOLATION MIDDLEWARES =====
// SECURITY: a tenant-bound user's tenant comes from the trusted SESSION and can never be
// overridden by an x-tenant-id header (see tenant_resolve.js). The header is honored only
// for a tenant-unbound privileged session (super admin) or the non-prod dev fallback.



// Middleware: block any request that has no tenantId in production


const requirePermission = makeRequirePermission({
    pool,
    getRequestTenantContext,
    roleFallback: (req) => {
        const role = req.session?.user?.role;
        const perms = ROLE_PERMISSIONS[role];
        if (perms === '*') return true; // Admin
        const orderModules = ['doctor', 'lab', 'radiology', 'pharmacy'];
        return !!(perms && orderModules.some(m => perms.includes(m)));
    }
});


// Gate 7: idempotency guard for money/claim-mutating routes. OPT-IN (only engages when the
// client sends an Idempotency-Key header) and FAIL-OPEN (never blocks billing on an infra
// error), so applying it is a zero-behavior-change addition for existing clients. Backed by
// the RLS-scoped idempotency_keys table (e23); replays return the stored response instead of
// re-running the handler (no duplicate claim/invoice/AR posting).
const idempotencyGuard = makeIdempotencyGuard({
    pool,
    getTenantId: (req) => getRequestTenantContext(req).tenantId,
    logger: console,
});


// ===== SMS NOTIFICATION HELPERS (extracted -> lib/notifications/notifyHelpers.js; behavior-preserving) =====
const { sendLabResultNotification, sendDoctorSMS, sendRadiologyResultNotification, sendPatientEmail, sendDoctorEmail } =
    require('./lib/notifications/notifyHelpers')({ pool, smsService, emailService });
// ===== EPIC E17 — Quality / Incidents / CAPA + Infection Control =====
// Fail-closed tenant guard for E17: returns integer tenantId or throws (caller -> 403).

// Server-side authority enums (client may NOT invent values).
const E17_INCIDENT_SEVERITY = ['low', 'medium', 'high', 'critical'];
const E17_INCIDENT_HARM = ['None', 'Mild', 'Moderate', 'Severe', 'Death'];
const E17_INCIDENT_TYPES = ['medication_error', 'fall', 'infection', 'equipment', 'complaint', 'near_miss', 'other'];

// Incident workflow state machine (server-enforced).
const E17_INCIDENT_TRANSITIONS = {
    'Open': ['Investigating', 'Closed'],
    'Investigating': ['Action', 'Closed'],
    'Action': ['Closed'],
    'Closed': []
};

// CAPA state machine (server-enforced; rejects invalid transitions with 409).
const E17_CAPA_TRANSITIONS = {
    'Pending': ['InProgress', 'Cancelled'],
    'InProgress': ['Completed', 'Cancelled'],
    'Completed': ['Verified'],
    'Verified': [],
    'Cancelled': []
};
const E17_CAPA_TYPES = ['Corrective', 'Preventive'];

// Risk register: server computes score + level (anti-spoof — never trusts client).
const E17_PRECAUTION_TYPES = ['standard', 'contact', 'droplet', 'airborne', 'protective'];
const E17_AMS_SEVERITY = ['Advisory', 'Action Required', 'Critical'];


// ===== SINGLE SESSION ENFORCEMENT =====
// Track active session IDs per user to prevent concurrent logins
const activeUserSessions = new Map(); // userId -> sessionId

// ===== AUTH ROUTES =====
// A2: establish authenticated session — shared by password-only login and post-MFA completion

// A2 MFA — RFC-6238 TOTP via built-in crypto (no external dependency); secrets are never logged
const MFA_B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
// TOTP replay guard: reject any code whose 30s counter was already consumed for this user (in-memory; codes expire in ~90s so this needs no persistence)
const mfaLastCounter = new Map();

// ===== VAT HELPER (extracted -> lib/billing/vatHelpers.js; behavior-preserving) =====
const { calcVAT, addVAT } = require('./lib/billing/vatHelpers')({ pool });

// ===== /API/AUTH (extracted -> routes/auth.routes.js; behavior-preserving) =====
app.use(require('./routes/auth.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, activeUserSessions, bcrypt, ce, establishSession, loginLimiter, mfaConsume }));


// ===== A2 MFA (TOTP) — opt-in; NO global enforcement (mfa_enabled per-user, default false) =====
// ===== /API/MFA (extracted -> routes/mfa.routes.js; behavior-preserving) =====
app.use(require('./routes/mfa.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, bcrypt, ce, mfaConsume, mfaGenSecret, mfaVerify, requireTenantAdmin }));

// begin enrollment: issue a fresh secret (mfa stays disabled until /verify confirms a live code)

// confirm enrollment (or re-verify): on first enable, issue one-time recovery codes (returned once; only hashes stored)

// second factor at login — uses the pending challenge set by /api/auth/login; accepts TOTP or a one-time recovery code

// self-disable own MFA — requires a valid current TOTP

// admin reset — Admin only; the recovery path so MFA can never permanently lock out any user (incl. the last admin)

// ===== /API/HEALTH (extracted -> routes/health.routes.js; behavior-preserving) =====
app.use(require('./routes/health.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));

// New: GET /api/system/info
// Public endpoint: deployment + build metadata. NO secrets, NO PHI, NO tenant data.
// Safe to call without auth so that external monitors (Cloudflare, Hetzner, etc.) can
// verify the deployed version matches the expected one.
// ===== /API/SYSTEM (extracted -> routes/system.routes.js; behavior-preserving) =====
app.use(require('./routes/system.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, app }));


// ===== VAT HELPER =====

// ===== DASHBOARD (extracted -> routes/dashboard.routes.js; behavior-preserving) =====
app.use(require('./routes/dashboard.routes.js')({ pool, requireAuth, requireTenantScope, getRequestTenantContext }));

// ===== PATIENTS CRUD (extracted -> routes/patients.routes.js; behavior-preserving) =====
app.use(require('./routes/patients.routes.js')({ pool, requireAuth, requireRole, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, requireTenantScope }));
// ===== NURSING =====
// ===== /API/NURSING (extracted -> routes/nursing.routes.js; behavior-preserving) =====
app.use(require('./routes/nursing.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, nursingScores, specialtyScores }));



// ===== APPOINTMENTS =====
// ===== /API/APPOINTMENTS (extracted -> routes/appointments.routes.js; behavior-preserving) =====
app.use(require('./routes/appointments.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, smsService, sendPatientEmail, optionalReadFallback }));



// ===== OPD — OUTPATIENT DEPARTMENT (سير عمل العيادات الخارجية) =====
// ===== /API/OPD (extracted -> routes/opd.routes.js; behavior-preserving) =====
app.use(require('./routes/opd.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));



// ===== EMPLOYEES =====
// H-7 Option C: GET stays open for staff/doctor lists, but compensation fields (salary/commission)
// are projected out for non-HR/non-Admin callers. `cols` is a server-controlled constant (never client input).
// ===== /API/EMPLOYEES (extracted -> routes/employees.routes.js; behavior-preserving) =====
app.use(require('./routes/employees.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, EMPLOYEE_DIRECTORY_COLS, isHrOrAdmin }));

// employee create/delete = HR/Admin only (requireRole('hr') passes HR + Admin='*'); GET stays open for doctor/staff lists


// ===== INVOICES =====
// ===== /API/INVOICES (extracted -> routes/invoices.routes.js; behavior-preserving) =====
app.use(require('./routes/invoices.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, sendBillingError, crypto, fe, idempotencyGuard, requirePermission }));


// ===== E11 INSURANCE / NPHIES (eligibility, pre-auth, claims lifecycle, denials, payer pricing) =====
// Security model: every route requireAuth + requireRole(insurance/finance/admin) + requireTenantScope;
//   every query carries an explicit AND tenant_id=$N on top of FORCE RLS; e11RequireTenant fails CLOSED
//   (403, no unscoped fallback); claim status/adjudication are server-authoritative (client cannot set
//   approved/amounts); invalid lifecycle transitions are rejected 409; every mutation is audited.
const E11_INS_ROLES = ['insurance', 'finance'];

// fail-closed tenant resolver: null tenant => throw 403 (no unscoped fallback). Mirrors e7/e8/e9/e10.
// integer-id coercion guard: positive integer or null (no padded-string/float bypass — E6 lesson).
// NPHIES external integration gate — default OFF (no real creds => never call NPHIES; intent-only stub).

// ----- Insurance companies (tenant-scoped) -----
// ===== /API/INSURANCE (extracted -> routes/insurance.routes.js; behavior-preserving) =====
app.use(require('./routes/insurance.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, E11_INS_ROLES, e11Engine, e11Err, e11IntId, e11Money, e11NphiesEnabled, e11RequireTenant, idempotencyGuard, optionalReadFallback }));


// ----- Insurance policies (tenant-scoped, read) -----

// ----- Eligibility check (NPHIES GATED; intent-only stub when NPHIES_ENABLED off) -----


// NPHIES Aliases for eligibility checks
// ===== /API/NPHIES (extracted -> routes/nphies.routes.js; behavior-preserving) =====
app.use(require('./routes/nphies.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, E11_INS_ROLES, e11Engine, e11Err, e11IntId, e11NphiesEnabled, e11RequireTenant, ensureCOAAccount, idempotencyGuard, optionalReadFallback, postTransactionToGL }));


// ----- Pre-authorization workflow (request -> approved/denied/partial; server-authoritative) -----


// pre-auth decision — server-authoritative state machine (requested -> approved/denied/partial)

// ----- Claims (lifecycle: draft -> submitted -> adjudicated -> remittance_posted; denied/appealed) -----

// create claim — always 'draft'/'Pending'; amounts requested only, adjudication is server-side later

// claim state transition — single server-authoritative endpoint (replaces direct status PUT)

// LEGACY status PUT — HARDENED: route the old client {status} payload through the state machine (409 on invalid).
// Pre-existing window.updateClaim still calls PUT /api/insurance/claims/:id with {status:'Approved'|'Rejected'}.

// ----- Claim lines (link claim -> medical_services chargemaster) -----


// ----- Denials + appeals -----


// ----- Payer pricing tiers (per-payer chargemaster) -----


// ----- NPHIES submission (GATED — 503 stub when NPHIES_ENABLED off; records submission intent) -----
// ===== end E11 INSURANCE / NPHIES =====

// ===== /API/MEDICAL (extracted -> routes/medical.routes.js; behavior-preserving) =====
app.use(require('./routes/medical.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, optionalReadFallback, requireCatalogAccess }));


// ===== EMR LOCK / SIGNATURE (Phase A1) — sign+lock, amend (no silent edit after lock); tenant-scoped via RLS =====
// SIGNATURE ATTRIBUTION: signing+locking a physician medical record is a PHYSICIAN act only.
// Nurses document via nursing_vitals / assessments / MAR — they must not sign medical_records.
// ===== /API/MEDICAL-RECORDS (extracted -> routes/medical-records.routes.js; behavior-preserving) =====
app.use(require('./routes/medical-records.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));

// Amending a locked physician record is a PHYSICIAN act (signature attribution).


// ===== MEDICAL SERVICES =====


// ===== DOCTOR PROCEDURE BILLING =====

// ===== DEPARTMENT RESOURCE REQUESTS =====
// ===== /API/DEPT-REQUESTS (extracted -> routes/dept-requests.routes.js; behavior-preserving) =====
app.use(require('./routes/dept-requests.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, checkAndTriggerAutoReorder, optionalReadFallback }));




// ===== BILLING SUMMARY =====
// ===== /API/BILLING (extracted -> routes/billing.routes.js; behavior-preserving) =====
app.use(require('./routes/billing.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, assignTenantPlanHelper }));

// ===== CATALOG APIs =====
// ===== /API/CATALOG (extracted -> routes/catalog.routes.js; behavior-preserving) =====
app.use(require('./routes/catalog.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, requireCatalogAccess }));




// ===== LAB =====
// ===== /API/LAB (extracted -> routes/lab.routes.js; behavior-preserving) =====
app.use(require('./routes/lab.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, sendLabResultNotification, sendDoctorSMS, sendDoctorEmail, lis, lisRequireTenant, resultLoop }));




// ============================================================================
// ===== E3 LABORATORY / LIS — sample lifecycle, structured results, =====
// =====    auto-verification, critical call-back, HL7 ingest, QC      =====
// ----------------------------------------------------------------------------
// CLINICAL SAFETY + TENANT SECURITY rules enforced on EVERY endpoint below:
//   * requireAuth + requireTenantScope (lab routes historically only had requireAuth).
//   * Explicit `tenant_id = $N` predicate on EVERY query (defense-in-depth) ON TOP of FORCE RLS.
//   * FAIL-CLOSED: a null tenant in production is rejected by requireTenantScope (403); the
//     handlers additionally refuse to run unscoped writes (no tenantId -> 400).
//   * FAIL-SAFE auto-verify (lis.autoVerify): any uncertainty -> HOLD, never silent verify.
//   * A CRITICAL result CANNOT transition to 'Reported' until a documented call-back exists.
// ----------------------------------------------------------------------------

// Helper: hard tenant gate for LIS writes (fail-closed). Returns tenantId or sends 400 and returns null.

// ---- SAMPLES: list ----

// ---- SAMPLES: collect (create specimen, server-generated barcode) ----

// ---- SAMPLES: state transition (receive / in-process / reject) ----

// ---- RESULTS: list (optionally by sample) ----

// ---- RESULTS: enter a result (runs auto-verification; FAIL-SAFE HOLD) ----

// ---- RESULTS: manual verify (for HELD results) ----

// ---- CRITICAL CALL-BACK: document a call-back for a critical result ----

// ---- RESULTS: report/release (FAIL-CLOSED: critical needs a documented call-back) ----

// ===== GATE 3: PHYSICIAN RESULT ACKNOWLEDGEMENT =====




// POST /api/results/:type/:id/acknowledge — the ordering/covering physician documents
// having reviewed a verified abnormal/critical result. Level comes from the server-side
// resultLoop.ackRequirement policy, never from the client.
// ===== /API/RESULTS (extracted -> routes/results.routes.js; behavior-preserving) =====
app.use(require('./routes/results.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, auditResultAckFallback, lisRequireTenant, resultAckTableExists, resultLoop }));

// GET /api/results/unacknowledged — physician worklist of verified abnormal/critical lab
// results not yet acknowledged by anyone (server-side policy; normal results excluded).

// ---- HL7 INBOUND (gated; sandbox parse+store only, NO external connection) ----
// Accepts a raw HL7 v2 ORU-style payload, parses it (lis.parseHL7ORU), matches the specimen
// by barcode WITHIN THIS TENANT (cross-tenant barcode -> no match -> 404), and stores results
// with auto-verification. Malformed payloads are rejected safely (400). FEATURE-GATED.

// ---- QC: list ----

// ---- QC: enter a point (Levey-Jennings / Westgard 1-3s) ----

// ===== RADIOLOGY =====
// ===== RAD worklist state machine (needed by radiology mount above its old position) =====
const RAD_WORKLIST_STATES = ['Scheduled', 'Arrived', 'InProgress', 'Completed', 'Reported'];
const RAD_WORKLIST_NEXT = {
    Scheduled: ['Arrived'],
    Arrived: ['InProgress'],
    InProgress: ['Completed'],
    Completed: ['Reported'],
    Reported: []
};
const RAD_MWL_ENABLED = String(process.env.RAD_MWL_ENABLED || '').toLowerCase() === 'true';

// ===== /API/RADIOLOGY (extracted -> routes/radiology.routes.js; behavior-preserving) =====
app.use(require('./routes/radiology.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, sendDoctorSMS, sendRadiologyResultNotification, resultLoop, ce, upload, isOptionalReadSchemaError, optionalReadFallback, RAD_MWL_ENABLED, RAD_WORKLIST_NEXT, RAD_WORKLIST_STATES }));





// A3A: guarded PHI file download — auth + EXPLICIT tenant predicate (defense-in-depth atop FORCE RLS); path-traversal denied; content-type pinned (no sniff-to-active-content)
// ===== /API/PHI-FILES (extracted -> routes/phi-files.routes.js; behavior-preserving) =====
app.use(require('./routes/phi-files.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, ce, upload }));

// ============================================================================
// ===== E4: RADIOLOGY — RIS WORKLIST + DICOM STUDIES (metadata) + STRUCTURED REPORTS
// All E4 endpoints are tenant-scoped with an EXPLICIT tenant_id predicate on EVERY
// query (defense-in-depth atop FORCE RLS), FAIL-CLOSED on null tenant context, and
// audited. DICOM/image bytes are NEVER served here — only via guarded /api/phi-files/:id.
// PACS/MWL is GATED behind RAD_MWL_ENABLED (no external connection; metadata only).
// ============================================================================

// --- E4-S1: RIS worklist list (tenant-scoped) ---

// --- E4-S1: schedule a worklist exam from an existing radiology order (tenant-scoped) ---

// --- E4-S1: worklist state transition (Scheduled->Arrived->InProgress->Completed->Reported) ---

// --- E4-S2: DICOM study METADATA register (gated; metadata only; NO bytes here) ---

// --- E4-S2: list DICOM study metadata for an exam (tenant-scoped) ---

// --- E4-S2: DICOM Modality Worklist (MWL) — GATED, parse/serve scheduled exams only; NO external connection ---

// --- E4-S3: prior-comparison — only SIGNED priors, same patient + modality, within tenant ---

// --- E4-S3: create / update a structured report draft (tenant-scoped) ---

// --- E4-S3: record critical-finding notification (documents the call-back; required before signing) ---
// RBAC: report state-mutating endpoints are restricted to radiology/doctor (medico-legal) — not any tenant user.

// --- E4-S3: SIGN report — FAIL-CLOSED if critical without documented notification ---

// --- E4-S3: addendum to a SIGNED report (creates a new linked report) ---

// --- E4: list reports for an exam (tenant-scoped) ---
// ===== END E4 RADIOLOGY =====

// ===== PHARMACY =====
const { e14PatientInTenant, e14PregnancyInTenant, getPatientActiveMeds, e18BeginTenantTx, withPharmacyTx } = require('./lib/pool-fns/tx')({ pool });

// ===== /API/PHARMACY (extracted -> routes/pharmacy.routes.js; behavior-preserving) =====
app.use(require('./routes/pharmacy.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, cds, getPatientActiveMeds, withPharmacyTx, optionalReadFallback }));

// Pharmacy low stock alerts


// NOTE: GET /api/pharmacy/queue and PUT /api/pharmacy/queue/:id are registered below
// (E5 enriched versions, ~line 5165) with file_number/phone/age/department + VAT +
// patient verification. The legacy duplicates that used to live here were removed
// (I1) because Express only honours the FIRST registration, leaving the E5 routes dead.

// ===== INVENTORY =====
// ===== /API/INVENTORY (extracted -> routes/inventory.routes.js; behavior-preserving) =====
app.use(require('./routes/inventory.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, checkAndTriggerAutoReorder, e16, e16BeginTenantTx, e16RequireTenant, optionalReadFallback }));


// ===== HR =====
// ===== /API/HR (extracted -> routes/hr.routes.js; behavior-preserving) =====
app.use(require('./routes/hr.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e18, e18RequireTenant, e18BeginTenantTx, optionalReadFallback }));





// ===== FINANCE =====
// ============================================================================================
// ===== E10 FINANCE / GENERAL LEDGER (double-entry) + ZATCA E-INVOICE =========================
// Posting to the ledger is GATED OFF by default (ACCOUNTING_POSTING_ENABLED). Journal entries are
// created as DRAFT; an explicit POST flips them to POSTED only when the flag is on. A POSTED entry
// is immutable (reversal-only). Every monetary mutation is auth+role+tenant guarded and audited.
// CRITICAL invariants: balanced-entry (sum debit==credit), posting-gate, tenant scoping.
// ============================================================================================

// posting gate — default OFF. Only "1"/"true" (case-insensitive) enables ledger posting.
// ZATCA external clearance/reporting gate — default OFF (no real CSID => never call ZATCA).
// fail-closed tenant resolver: null tenant => throw 403 (no unscoped fallback). Mirrors e7/e8/e9.
// integer-id coercion guard: positive integer or null (no padded-string / float bypass — E6 lesson).

// ----- Chart of Accounts (tenant-scoped; account_class validated server-side) -----
const E10_ACCOUNT_CLASSES = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];
// ===== /API/FINANCE (extracted -> routes/finance.routes.js; behavior-preserving) =====
app.use(require('./routes/finance.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, fe, E10_ACCOUNT_CLASSES, e10Err, e10IntId, e10PostingEnabled, e10RequireTenant, e10ZatcaEnabled, ensureCOAAccount, idempotencyGuard, postTransactionToGL }));


// ----- General Ledger: list journal entries (tenant-scoped, with totals) -----

// ----- General Ledger: read one entry with its lines (tenant-scoped, IDOR-safe) -----

// ----- General Ledger: create a balanced journal entry (DRAFT) — SERVER-SIDE balance enforcement -----
// Body: { entry_date, description, reference, source_type?, lines:[{account_id, debit, credit, notes?}] }
// Unbalanced (sum debit != sum credit) => 422. Created as DRAFT regardless of the posting flag.

// ----- General Ledger: POST a draft entry to the ledger — GATED by ACCOUNTING_POSTING_ENABLED -----
// State machine: DRAFT -> POSTED. Posting is irreversible (immutable); re-posting => 409.

// ----- General Ledger: REVERSE a posted entry (the only mutation of a POSTED entry) -----

// ----- AR Aging report (tenant-scoped buckets 0-30/31-60/61-90/90+) -----

// ----- Posting / ZATCA gate status (read-only; lets the UI show OFF state) -----

// ===== end E10 FINANCE / GENERAL LEDGER ======================================================

// ===== SaaS Integration Settings (Phase 4: Saudi Compliance) =====
// ===== /API/SETTINGS (extracted -> routes/settings.routes.js; behavior-preserving) =====
app.use(require('./routes/settings.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, bcrypt, ROLE_PERMISSIONS, userLimitGuard, requireTenantContext, requireTenantAdmin, createSystemUserWithTenantLink, validatePasswordPolicy }));



// ===== SETTINGS =====
// GET settings is allowed for all authenticated users (needed for theme loading)



// ===== P0 GUARD: creating system users is Admin-only (unified requireTenantAdmin; mirrors PUT/DELETE) =====
// 'settings' perm is held by non-admin roles (e.g. IT); without the Admin gate they could create an Admin account.



// ===== E0 FACILITY ONBOARDING WIZARD (super-admin facility provisioning) =====
// Mounted here (among route handlers, after :393) so it inherits CORS, session, CSRF-Origin check,
// and tenant-context middleware. The route is guarded inside the module by:
//   requireAuth + requireRole('settings') + inline (role !== 'Admin') -> 403 + audit BLOCKED_.
// It runs a single DB transaction, generates a strong random Admin password if none supplied
// (no default password), records integrations gated (no secrets), and writes FACILITY_PROVISIONED audit.
mountOnboardingRoutes(app, { pool, requireAuth, requireRole, logAudit, requireSuperAdmin, allowlist: process.env.SUPER_ADMIN_USERS });

// ===== MESSAGING =====
// ===== /API/USERS (extracted -> routes/users.routes.js; behavior-preserving) =====
app.use(require('./routes/users.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, ce, upload }));

// ===== /API/MESSAGES (extracted -> routes/messages.routes.js; behavior-preserving) =====
app.use(require('./routes/messages.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, optionalReadFallback, requirePermission }));


// ===== ONLINE BOOKINGS =====
// ===== /API/BOOKINGS (extracted -> routes/bookings.routes.js; behavior-preserving) =====
app.use(require('./routes/bookings.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));

// ===== PRESCRIPTIONS =====
// ===== /API/PRESCRIPTIONS (extracted -> routes/prescriptions.routes.js; behavior-preserving) =====
app.use(require('./routes/prescriptions.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, cds, getPatientActiveMeds }));
// Duplicate legacy POST /api/prescriptions route removed to prevent shadowing the CDS-protected route below.

// ===== PATIENT RESULTS (for Doctor to browse) =====


// ===== METADATA-DRIVEN CLINICAL EMR & SPECIALTIES =====

// ===== /API/CLINICAL (extracted -> routes/clinical.routes.js; behavior-preserving) =====
app.use(require('./routes/clinical.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));




// ===== Phase 3 Week Bundle: 13 AI Orchestrator endpoints (RAG + LLM shim) =====
// Each route requireAuth + requireRole(doctor/nursing) + requireTenantScope. tenant_id is
// stamped from the session (never from the body). The LLM call goes through ai_langchain_shim:
// live when LLM_API_KEY is set, deterministic RAG-grounded fallback otherwise.
const AI_ORCH_ROLE = requireRole('doctor', 'nursing');

// Lazy requires — orchestrators are constructed on each call; this avoids pulling in
// every vector store at boot (and keeps the AI route table declarative).

// ===== /API/AI (extracted -> routes/ai.routes.js; behavior-preserving) =====
app.use(require('./routes/ai.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, cds, _aiOrch, _aiWrap, AI_ORCH_ROLE }));



// ===== INVOICES (Enhanced) =====


// ===== MOYASAR PAYMENTS =====
// ===== /API/PAYMENTS (extracted -> routes/payments.routes.js; behavior-preserving) =====
app.use(require('./routes/payments.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, idempotencyGuard, paymentAdapter }));



// ===== CARDIOLOGY DEPARTMENT =====
// ===== /API/CARDIOLOGY (extracted -> routes/cardiology.routes.js; behavior-preserving) =====
app.use(require('./routes/cardiology.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));





// ===== WAVE 9: CENTERS OF EXCELLENCE — PATIENT-360 AGGREGATOR (shared helper) =====
// Aggregates any number of tenant-scoped specialty tables into a single Patient-360 response.
// Each Center mounts a thin route that calls centerPatient360 with its own table list.
// tenant isolation is enforced by both the explicit AND tenant_id=$N on every query AND the
// FORCE RLS policy on the wrapped tables. centerPatient360 itself also rejects null tenant.

// Heart & Vascular Center — Patient-360 (Wave 8). Aggregates cardiology_procedures + ecg_records
// + cardiology_assessments for the requested patient, all tenant-scoped.
// ===== CENTERS PATIENT-360 (extracted -> routes/centers-patient360.routes.js; behavior-preserving) =====
app.use(require('./routes/centers-patient360.routes.js')({ centerPatient360, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS }));

// Centers of Excellence — Patient-360 aggregators (Wave 9). One route per Center; each
// resolves tenant context inline and delegates to centerPatient360 with its own table list.
// Tenant-scoped read; explicit tenant filtering is applied via the shared helper.
// ===== /API/BEHAVIORAL-HEALTH-COE (extracted -> routes/behavioral-health-coe.routes.js; behavior-preserving) =====
app.use(require('./routes/behavioral-health-coe.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, centerPatient360 }));
// ===== /API/PAIN-COE (extracted -> routes/pain-coe.routes.js; behavior-preserving) =====
app.use(require('./routes/pain-coe.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, centerPatient360 }));
// ===== /API/CHILDRENS-HOSPITAL (extracted -> routes/childrens-hospital.routes.js; behavior-preserving) =====
app.use(require('./routes/childrens-hospital.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, centerPatient360 }));
// ===== /API/NEUROSCIENCE-COE (extracted -> routes/neuroscience-coe.routes.js; behavior-preserving) =====
app.use(require('./routes/neuroscience-coe.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, centerPatient360 }));
// ===== /API/BURN-COE (extracted -> routes/burn-coe.routes.js; behavior-preserving) =====
app.use(require('./routes/burn-coe.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, centerPatient360 }));
// ===== /API/TRANSPLANT-COE (extracted -> routes/transplant-coe.routes.js; behavior-preserving) =====
app.use(require('./routes/transplant-coe.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, centerPatient360 }));
// ===== /API/CANCER-CENTER (extracted -> routes/cancer-center.routes.js; behavior-preserving) =====
app.use(require('./routes/cancer-center.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, centerPatient360 }));

// ===== GASTROENTEROLOGY DEPARTMENT =====
// ===== /API/GASTRO (extracted -> routes/gastro.routes.js; behavior-preserving) =====
app.use(require('./routes/gastro.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));





// ===== ENDOCRINOLOGY & DIABETES DEPARTMENT =====
// ===== /API/ENDOCRINE (extracted -> routes/endocrine.routes.js; behavior-preserving) =====
app.use(require('./routes/endocrine.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));





// ===== NEPHROLOGY & DIALYSIS DEPARTMENT =====
// ===== /API/NEPHROLOGY (extracted -> routes/nephrology.routes.js; behavior-preserving) =====
app.use(require('./routes/nephrology.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ===== OPHTHALMOLOGY DEPARTMENT =====
// ===== /API/OPHTHALMOLOGY (extracted -> routes/ophthalmology.routes.js; behavior-preserving) =====
app.use(require('./routes/ophthalmology.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ===== GENERAL SURGERY DEPARTMENT (G09) =====
// ===== /API/SURGERY (extracted -> routes/surgery.routes.js; behavior-preserving) =====
app.use(require('./routes/surgery.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));




// ===== UROLOGY DEPARTMENT (G15) =====
// ===== /API/UROLOGY (extracted -> routes/urology.routes.js; behavior-preserving) =====
app.use(require('./routes/urology.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ===== CARDIOTHORACIC & VASCULAR DEPARTMENT (G16) =====


// ===== ANESTHESIA & PAIN DEPARTMENT (G19) =====
// ===== /API/ANESTHESIA (extracted -> routes/anesthesia.routes.js; behavior-preserving) =====
app.use(require('./routes/anesthesia.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ===== NEONATAL & PEDIATRICS DEPARTMENT (G20) =====
// ===== /API/PEDIATRICS (extracted -> routes/pediatrics.routes.js; behavior-preserving) =====
app.use(require('./routes/pediatrics.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, specialtyScores }));


// ===== OBGYN DEPARTMENT (G21) =====
const OB_RBAC = ['obgyn', 'antenatal', 'doctor', 'nursing'];
// ===== /API/OBGYN (extracted -> routes/obgyn.routes.js; behavior-preserving) =====
app.use(require('./routes/obgyn.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e14IntId, e14PatientInTenant, e14PregnancyInTenant, e14RequireTenant, OB_RBAC, obEngine, optionalReadFallback }));


// ===== PSYCHIATRY DEPARTMENT (G24) =====
// ===== /API/PSYCHIATRY (extracted -> routes/psychiatry.routes.js; behavior-preserving) =====
app.use(require('./routes/psychiatry.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ===== DERMATOLOGY DEPARTMENT (G25) =====
// ===== /API/DERMATOLOGY (extracted -> routes/dermatology.routes.js; behavior-preserving) =====
app.use(require('./routes/dermatology.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ===== ENT (OTOLARYNGOLOGY) DEPARTMENT =====
// ===== /API/ENT (extracted -> routes/ent.routes.js; behavior-preserving) =====
app.use(require('./routes/ent.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ===== PLASTIC & BURNS DEPARTMENT (G12) =====
// ===== /API/PLASTIC-BURNS (extracted -> routes/plastic-burns.routes.js; behavior-preserving) =====
app.use(require('./routes/plastic-burns.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));




// ===== INTENSIVE CARE DEPARTMENT (G17) =====
// ===== /API/ICU (extracted -> routes/icu.routes.js; behavior-preserving) =====
app.use(require('./routes/icu.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, specialtyScores, cds, e9IntId, e9LoadActiveIcuAdmission, e9PostFlowsheet, e9PostScore, e9RequireTenant, icuScoring }));


// ===== ORTHOPEDICS DEPARTMENT (G10) =====
// ===== /API/ORTHOPEDICS (extracted -> routes/orthopedics.routes.js; behavior-preserving) =====
app.use(require('./routes/orthopedics.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));






// ===== PULMONOLOGY DEPARTMENT =====
// ===== /API/PULMONOLOGY (extracted -> routes/pulmonology.routes.js; behavior-preserving) =====
app.use(require('./routes/pulmonology.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, specialtyScores }));


// ===== RHEUMATOLOGY DEPARTMENT =====
// ===== /API/RHEUMATOLOGY (extracted -> routes/rheumatology.routes.js; behavior-preserving) =====
app.use(require('./routes/rheumatology.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, specialtyScores }));


// ===== NEUROLOGY DEPARTMENT =====
// ===== /API/NEUROLOGY (extracted -> routes/neurology.routes.js; behavior-preserving) =====
app.use(require('./routes/neurology.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, specialtyScores }));




// ===== PATIENT ACCOUNT =====

// ===== FORM BUILDER =====
// ===== /API/FORMS (extracted -> routes/forms.routes.js; behavior-preserving) =====
app.use(require('./routes/forms.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));



// ===== DOCTOR STATION — DEDICATED ENDPOINTS =====

/**
 * GET /api/doctor/wait-queue
 * قائمة انتظار الطبيب — تعرض المرضى في الانتظار مع بيانات المؤشرات الحيوية
 */
// ===== /API/DOCTOR (extracted -> routes/doctor.routes.js; behavior-preserving) =====
app.use(require('./routes/doctor.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));

/**
 * GET /api/patients/:id/chart
 * الملف السريري الكامل للمريض — يُحمَّل عند اختيار مريض في محطة الطبيب
 */

/**
 * GET /api/patients/:id/vitals  (alias to patient_scores)
 * المؤشرات الحيوية للمريض — مطلوبة لمحطة الطبيب
 */

/**
 * GET /api/patients/:id/problems
 * قائمة المشكلات الطبية للمريض
 */

/**
 * POST /api/patients/:id/problems
 * إضافة مشكلة طبية للمريض
 */

/**
 * GET /api/patients/:id/allergies
 * قائمة الحساسيات للمريض
 */

/**
 * GET /api/patients/:id/medications
 * الأدوية الحالية للمريض
 */

/**
 * GET /api/patients/:id/lab-results
 * نتائج المختبر والأشعة للمريض — مع تفاصيل كاملة
 */

/**
 * GET /api/patients/:id/active-orders
 * لوحة الأوامر النشطة — كل الأوامر المعلّقة والجارية للمريض
 */

/**
 * POST /api/orders  (clinical orders — lab, radiology, medication, nursing, diet, iv, referral, procedure, discharge)
 * إنشاء أمر طبي من محطة الطبيب
 */
// ===== /API/ORDERS (extracted -> routes/orders.routes.js; behavior-preserving) =====
app.use(require('./routes/orders.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));

/**
 * POST /api/encounters/:id/sign
 * التوقيع الإلكتروني على الزيارة وقفل السجل السريري
 */
// ===== /API/ENCOUNTERS (extracted -> routes/encounters.routes.js; behavior-preserving) =====
app.use(require('./routes/encounters.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));

/**
 * GET /api/patients/:id/history-extended
 * التاريخ السريري الشامل: اجتماعي، عائلي، جراحي، تطعيمات
 */

/**
 * POST/PUT /api/patients/:id/social-history
 * حفظ/تحديث التاريخ الاجتماعي للمريض
 */

/**
 * POST /api/patients/:id/family-history
 * إضافة بند في التاريخ العائلي
 */

/**
 * GET /api/pharmacy/drugs
 * قائمة الأدوية من الصيدلية
 */

/**
 * GET /api/medical/services
 * الخدمات الطبية
 */

// ===== WAITING QUEUE =====
// ===== /API/QUEUE (extracted -> routes/queue.routes.js; behavior-preserving) =====
app.use(require('./routes/queue.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));





// ===== EXAM ROOMS & CLINICS =====







// ===== PATIENT REFERRAL =====

// ===== REPORTS =====
// ===== /API/REPORTS (extracted -> routes/reports.routes.js; behavior-preserving) =====
app.use(require('./routes/reports.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));



// ===== ONLINE BOOKINGS MANAGEMENT =====

// ===== DOCTOR COMMISSION REPORT =====

// ===== MEDICAL CERTIFICATES =====


// ===== PATIENT REFERRALS =====
// ===== /API/REFERRALS (extracted -> routes/referrals.routes.js; behavior-preserving) =====
app.use(require('./routes/referrals.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));



// ===== FOLLOW-UP APPOINTMENTS =====

// ===== ENHANCED DASHBOARD STATS =====

// ===== PATIENT VISIT TIMELINE =====

// ===== SURGERY MANAGEMENT =====
// ===== /API/SURGERIES (extracted -> routes/surgeries.routes.js; behavior-preserving) =====
app.use(require('./routes/surgeries.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, E12_WHO_ORDER, e12IsValidSurgeryTransition, e12NormalizeStatus }));

// Added to allow secure fetch of single surgery record and prevent IDOR




// Pre-op Assessment


// Pre-op Tests


// ===== /API/SURGERY-PREOP-TESTS (extracted -> routes/surgery-preop-tests.routes.js; behavior-preserving) =====
app.use(require('./routes/surgery-preop-tests.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));

// Anesthesia Records


// Operating Rooms
// ===== /API/OPERATING-ROOMS (extracted -> routes/operating-rooms.routes.js; behavior-preserving) =====
app.use(require('./routes/operating-rooms.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ============================================================================
// ===== EPIC E12 — SURGERY / OPERATING ROOM (OR scheduling, WHO checklist, PACU, operative note + consumption)
// ============================================================================
// Fail-closed tenant resolver for E12: throws in production when no tenant is bound.
// Mirrors the e7/e8/e9 requireTenant pattern (NO unscoped fallback in production).

// Integer-only id coercion (no string/padded-id coercion bypass — E6 lesson).

// ---- Surgery status state machine (server-enforced; reject invalid transitions 409) ----
// Scheduled -> InProgress -> PACU -> Completed (+ Cancelled from any non-terminal).
const E12_SURGERY_STATUS = ['Scheduled', 'InProgress', 'PACU', 'Completed', 'Cancelled'];
const E12_SURGERY_TRANSITIONS = {
    'Scheduled': ['InProgress', 'Cancelled'],
    'In Progress': ['InProgress', 'PACU', 'Cancelled'], // tolerate legacy label
    'InProgress': ['PACU', 'Cancelled'],
    'PACU': ['Completed', 'Cancelled'],
    'Completed': [],
    'Cancelled': []
};

// ---- WHO Safe Surgery Checklist phase state machine ----
// Not Started -> Sign-In -> Time-Out -> Sign-Out -> Completed (sequential; skipping -> 409).
const E12_WHO_PHASE_TO_STATE = { 'sign-in': 'Sign-In', 'time-out': 'Time-Out', 'sign-out': 'Sign-Out' };

// Helper: verify surgery ownership (tenant-scoped). Returns row or null.

// ===== E12: OR SCHEDULING — slots + conflict detection + transactional reservation =====
// List slots for a room/date (tenant scoped).
// ===== /API/OR (extracted -> routes/or.routes.js; behavior-preserving) =====
app.use(require('./routes/or.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, checkAndTriggerAutoReorder, E12_WHO_ORDER, E12_WHO_PHASE_TO_STATE, e12IntId, e12IsValidSurgeryTransition, e12LoadSurgery, e12NormalizeStatus, e12RequireTenant, e12WhoNextState, optionalReadFallback, requirePermission }));

// Reserve a slot for a surgery: conflict detection (no double-booked room/surgeon/time -> 409),
// transactional with SELECT ... FOR UPDATE. tenant_id stamped from session (anti mass-assignment).

// Cancel a slot (frees the room/surgeon window). Tenant scoped.

// ===== E12: SURGERY STATE MACHINE (replaces unguarded status flips) =====
// Server-enforced transitions. Moving to InProgress requires WHO Time-Out completed (no incision without Time-Out).
// Moving to PACU requires a PACU record (handled by /pacu). Completed requires sign-out.

// ===== E12: WHO SAFE SURGERY CHECKLIST =====

// Advance one WHO phase. :phase in {sign-in, time-out, sign-out}. Strict ordering enforced server-side (409 on skip).

// ===== E12: PACU (recovery) record =====

// Create/update PACU record. Requires WHO Sign-Out completed first (cannot recover before leaving OR safely).

// ===== E12: OPERATIVE NOTE + CONSUMPTION (decrement inventory if present) =====

// Save operative note + record consumption lines, decrementing inventory_items.stock_qty transactionally.
// Locks inventory rows in ascending id order (deadlock avoidance). Counts-not-verified -> 'Incomplete' (never falsely reassuring).

// ===== BLOOD BANK (LEGACY READ ROUTES — tenant-scoped hardening; E13) =====
// These legacy /api/blood-bank/* paths are retained for backward compatibility
// but are now tenant-scoped (were cross-tenant leaks). The PRIMARY UI uses the
// new /api/bloodbank/* safe routes. Legacy MUTATION paths are deprecated (410)
// further below (see E13 BLOOD BANK SAFE block).
// ===== /API/BLOOD-BANK (extracted -> routes/blood-bank.routes.js; behavior-preserving) =====
app.use(require('./routes/blood-bank.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e13RequireTenant, e13Respond }));

// Legacy unit creation -> deprecated; use POST /api/bloodbank/units (validated + tenant-stamped).

// Legacy unit status PUT -> deprecated; use the state-machine routes (discard/recall/transfuse).


// Legacy donor creation -> deprecated; use POST /api/bloodbank/donors (tenant-stamped).

// Legacy crossmatch creation -> deprecated; the safe route enforces server-side ABO/Rh.




// =====================================================================
// ===== E13 BLOOD BANK (SAFE) — /api/bloodbank/* ======================
// =====================================================================
// World-class blood-bank workflow with the critical safety invariants:
//  - server-side ABO/Rh compatibility (bbCompat); client cannot mark compatible
//  - ABO/Rh-incompatible crossmatch => 422 fail-closed
//  - expired unit => never issuable (block); near-expiry alerts
//  - transactional unit issue under SELECT ... FOR UPDATE; double-issue => 409
//  - tenant isolation on every query (explicit AND tenant_id=$N on top of FORCE RLS)
//  - RBAC (requireRole('bloodbank','lab','nursing','doctor')) + logAudit on every mutation
//
// e13RequireTenant: returns the request tenant or THROWS (fail-closed). Never
// returns a fallback that would widen scope; the route catch -> 403.
const BB_VALID_COMPONENTS = ['Whole Blood', 'Packed RBC', 'FFP', 'Platelets', 'Cryoprecipitate'];
const BB_NEAR_EXPIRY_DAYS = 7;

// --- Inventory: list units (tenant-scoped, near-expiry flags) ---
// ===== /API/BLOODBANK (extracted -> routes/bloodbank.routes.js; behavior-preserving) =====
app.use(require('./routes/bloodbank.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, BB_NEAR_EXPIRY_DAYS, BB_VALID_COMPONENTS, bbCompat, e13RequireTenant, e13Respond }));

// --- Inventory: create unit (tenant-stamped, audited) ---

// --- Inventory: discard a unit (state machine; cannot discard a transfused unit) ---

// --- Crossmatch: list (tenant-scoped) ---

// --- Crossmatch: create with SERVER-SIDE ABO/Rh check (fail-closed 422) ---
// The critical safety route. patient ABO/Rh is read from the patients table
// (NOT trusted from the client). If a unit is specified its ABO/Rh is read
// from blood_bank_units. Incompatible => 422 and NO row is persisted as Compatible.

// --- Crossmatch: validate an existing crossmatch against a unit (server-side, fail-closed) ---
// Replaces the legacy client-marked PUT. Sets Compatible ONLY if the engine agrees.

// --- Transfusion list (tenant-scoped) ---

// --- Transfuse: issue a unit transactionally (the shared-resource race-safe route) ---
// Locks the unit FOR UPDATE, re-checks status+expiry+ABO/Rh under the lock, flips
// status Available -> Transfused atomically, inserts the transfusion record.
//   incompatible -> 422 ; already issued/used -> 409 ; expired -> 422.

// --- Transfusion reaction reporting (audited; flags unit for recall lookback) ---
// F1-FIX: Both writes (INSERT reaction + UPDATE transfusion) wrapped in a single
//         BEGIN/COMMIT transaction on a pool client so an UPDATE failure cannot
//         leave an orphaned reaction row.

// --- Recall / lookback: trace a unit -> its donor's other units + all its transfusions ---

// --- Recall a unit: mark Discarded if not yet transfused (transactional) ---

// --- Donors (tenant-scoped) ---


// --- Stats (tenant-scoped) ---

// --- LEGACY guard: the old client-marked crossmatch PUT is hardened (no client compatible-mark) ---
// E5/E6/E7/E8 lesson: after adding the safe route, neutralize the legacy bypass.
// --- LEGACY guard: old transfusion POST that hard-marked status without locks ---

// ===== CONSENT FORMS =====
// ===== /API/CONSENT-FORMS (extracted -> routes/consent-forms.routes.js; behavior-preserving) =====
app.use(require('./routes/consent-forms.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));





// ===== CONSENT FORM HTML RENDERER (Auto-fill patient data) =====


// ===== LAB & RADIOLOGY ORDERS (Payment-First Workflow) =====
// Doctor creates order → status='Pending Payment' → Reception pays → status='Requested' → Lab/Rad processes

// Get lab orders (only paid/approved ones visible to lab)

// Get radiology orders (only paid/approved ones visible to radiology)

// Get ALL pending payment orders (for reception)

// Doctor creates lab order (goes to reception first)

// Doctor creates radiology order (goes to reception first)

// Direct lab order (from lab page - auto approved)

// Reception approves payment → order goes to Lab/Radiology

// Update lab/radiology order status (In Progress, Done)

// Get single order

// Get patient's lab/radiology results
// ===== /API/PATIENT (extracted -> routes/patient.routes.js; behavior-preserving) =====
app.use(require('./routes/patient.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));

// ===== EMERGENCY DEPARTMENT =====
// ===== /API/EMERGENCY (extracted -> routes/emergency.routes.js; behavior-preserving) =====
app.use(require('./routes/emergency.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, specialtyScores, e7RequireTenant }));







// ===== E7: EMERGENCY DEPARTMENT — ESI TRIAGE, TRACKING BOARD, WORKFLOW STATE MACHINE =====
// All routes: requireAuth + requireRole('emergency','nursing','doctor') + requireTenantScope.
// ESI level is computed SERVER-SIDE by esi_engine.computeESI() from clinical inputs; any
// client-sent esi_level is advisory only and is NEVER trusted. Every query carries an explicit
// AND tenant_id=$N on top of FORCE RLS; a null tenant fails closed (403 / zero rows) — never
// an unscoped fallback. The PRIMARY UI buttons (triage / assign provider / disposition) call
// these guarded routes — there is no shadow/unguarded path.

// Fail-closed tenant resolver for E7: throws when tenant is missing so no helper ever runs unscoped.

// ED workflow phases + valid transitions (server-authoritative state machine).
const ER_PHASES = ['Arrival', 'Triage', 'Waiting', 'InTreatment', 'Disposition'];
const ER_DISPOSITIONS = ['Admitted', 'Discharged', 'Transferred', 'LWBS'];

// GET /api/er/board — active ED patients ordered by ESI priority (1 first) then arrival time.
// ===== /API/ER (extracted -> routes/er.routes.js; behavior-preserving) =====
app.use(require('./routes/er.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e7RequireTenant, ER_DISPOSITIONS, esiEngine }));

// POST /api/er/triage — compute ESI SERVER-SIDE, persist, set phase Waiting, start the clock.
// Body: { visit_id, vitals:{hr,rr,spo2,sbp,temp,loc}, chief_complaint, pain_score, resources|resource_count,
//         high_risk, age, ... }  (any client-sent esi_level is ignored.)

// POST /api/er/assign-provider — provider picks up the patient; record time-to-provider.
// Body: { visit_id, provider }  (provider name; defaults to acting user.)

// POST /api/er/disposition — close the ED encounter (admit[->ADT]/discharge/transfer/LWBS).
// Body: { visit_id, disposition_type, diagnosis, instructions, medications, followup_date,
//         admission_department, admitting_doctor }  State machine: disposition before triage => 409.

// ===== INPATIENT ADT =====
// ===== /API/WARDS (extracted -> routes/wards.routes.js; behavior-preserving) =====
app.use(require('./routes/wards.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));

// ===== /API/BEDS (extracted -> routes/beds.routes.js; behavior-preserving) =====
app.use(require('./routes/beds.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ===== /API/ADMISSIONS (extracted -> routes/admissions.routes.js; behavior-preserving) =====
app.use(require('./routes/admissions.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e8RequireTenant }));

// Added to allow secure fetch of single admission record and prevent IDOR





// ===== /API/BED-TRANSFERS (extracted -> routes/bed-transfers.routes.js; behavior-preserving) =====
app.use(require('./routes/bed-transfers.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));
// ===== /API/BED-TRANSFERS_LEGACY_DISABLED (extracted -> routes/bed-transfers_legacy_disabled.routes.js; behavior-preserving) =====
app.use(require('./routes/bed-transfers_legacy_disabled.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));

// ============================================================
// ===== E8 INPATIENT / ADT — state-machine, race-safe bed mgmt =====
// World-class ADT: admit / transfer / discharge + census + bed board, with a
// server-authoritative bed-status lifecycle and admission state machine. Every
// bed occupy/free is done inside a transaction with SELECT ... FOR UPDATE on the
// bed row so two concurrent admits can never double-occupy one bed.
// ============================================================

// Fail-closed tenant resolver (mirrors e7RequireTenant — generic, no unscoped fallback).

// Server-authoritative bed status lifecycle. 'Available' is the legacy vacant terminal
// (kept for backward compat with the existing schema/seeds). Allowed transitions:
//   Available -> Reserved | Occupied      (reserve or direct admit)
//   Reserved  -> Occupied | Available     (admit the held bed, or release the hold)
//   Occupied  -> Cleaning | Available     (discharge/transfer-out -> needs cleaning, or freed directly)
//   Cleaning  -> Available | Blocked      (housekeeping done, or take offline)
//   Blocked   -> Available                 (return to service)
const E8_BED_STATUSES = ['Available', 'Reserved', 'Occupied', 'Cleaning', 'Blocked'];
const E8_BED_TRANSITIONS = {
    Available: ['Reserved', 'Occupied', 'Blocked', 'Cleaning'],
    Reserved: ['Occupied', 'Available'],
    Occupied: ['Cleaning', 'Available'],
    Cleaning: ['Available', 'Blocked'],
    Blocked: ['Available']
};
// A bed is "occupiable" by an admission only if currently free.
const E8_BED_FREE_STATES = ['Available', 'Reserved'];

// Admission lifecycle: Active -> (Transferred-in-place stays Active) -> Discharged.
// Discharge is only valid from an Active admission; transfer is only valid for Active.
const E8_ADMISSION_TERMINAL = ['Discharged'];

// Coerce an id to a positive integer (no string/padded-id coercion bypass — E6 lesson).

// GET /api/adt/beds — bed board (status + current patient) for the tenant.
// ===== /API/ADT (extracted -> routes/adt.routes.js; behavior-preserving) =====
app.use(require('./routes/adt.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, E8_ADMISSION_TERMINAL, E8_BED_FREE_STATES, E8_BED_STATUSES, e8CanTransitionBed, e8IntId, e8RequireTenant }));

// GET /api/adt/census — occupancy by ward. Only 'Occupied' counts as occupied;
// only 'Available' counts as available (Reserved/Cleaning/Blocked are neither —
// fixes the legacy binary census math which counted any non-Occupied as available).

// POST /api/adt/admit — admit a patient into a bed.
// Two modes (both tenant-scoped, race-safe):
//   (a) place an existing admission (e.g. an ER->ADT handoff row with no bed) into a bed:
//       body { admission_id, bed_id }
//   (b) create a new direct/elective admission and place it in a bed:
//       body { patient_id, patient_name, admission_type, attending_doctor, admitting_doctor,
//              department, ward_id, bed_id, diagnosis, icd10_code, diet_order, expected_los }
// The destination bed is locked FOR UPDATE; if it is not free (Available/Reserved) => 409.

// POST /api/adt/transfer — move an Active admission between beds/wards, atomically.
// body { admission_id, to_bed, transfer_reason }
// Locks BOTH beds FOR UPDATE; frees the source (-> Cleaning) and occupies the dest;
// rejects a dest that is not free (409); records the transfer in bed_transfers.

// POST /api/adt/discharge — end an Active admission, free its bed (-> Cleaning), record disposition.
// body { admission_id, discharge_type, discharge_summary, discharge_instructions,
//        discharge_medications, followup_date, followup_doctor }

// POST /api/adt/bed-status — explicit bed-status transition (housekeeping / blocking / reserve).
// body { bed_id, status }. Validated server-side against E8_BED_TRANSITIONS; an Occupied bed
// cannot be flipped to Available via this route (must go through discharge/transfer).

// ============================================================
// ===== E9 ICU / CRITICAL CARE (hardened) =====
// All routes: requireAuth + requireRole('icu','nursing','doctor') + requireTenantScope.
// Fail-closed tenant resolver (e9RequireTenant) — null tenant => 403 (NO unscoped fallback).
// Integer id coercion (e9IntId) — no string/padded-id bypass (E6 lesson).
// Writes only attach to an Active, tenant-owned admission whose bed is in an ICU/NICU/CCU ward.
// Acuity scores (SOFA/GCS/APACHE-II) are computed SERVER-SIDE via icu_scoring.js — any
// client-supplied score/band is ADVISORY ONLY and is IGNORED (anti-spoof, E6/E7 lesson).
// ICU wards classified by ward_type IN ('ICU','NICU','CCU').
// ============================================================
const E9_ICU_WARD_TYPES = ['ICU', 'NICU', 'CCU'];

// Fail-closed tenant resolver (mirrors e8RequireTenant — no unscoped fallback).

// Coerce an id to a positive integer (no string/padded-id coercion bypass — E6 lesson).

// Validate that admissionId belongs to this tenant, is Active, and sits in an ICU-typed ward.
// Returns the admission row (with patient_id) or throws an e9Status error.
//   - non-positive id  => 422
//   - not found / cross-tenant => 404 (no leak)
//   - not Active (e.g. Discharged) => 409
//   - not in an ICU/NICU/CCU ward => 409

// GET /api/icu/patients — Active admissions in ICU-typed wards (tenant-scoped, fail-closed).

// ----- ICU flowsheet (time-stamped vitals/hemodynamics/I-O) — backed by icu_monitoring -----
// POST /api/icu/flowsheet  (canonical blueprint name). Legacy alias: POST /api/icu/monitoring.

// ----- Infusions / drips (continuous IV meds) — NEW table icu_infusions -----
// Bonus safety: if a drug name is supplied, run a server-derived allergy check (cds.checkDrugAllergy)
// against the patient's active allergy list — fail-safe (records a warning, does NOT silently block).

// ----- ICU acuity scores (SERVER-SIDE SOFA / GCS / APACHE-II) — icu_scores -----
// POST /api/icu/score (canonical) + legacy alias POST /api/icu/scores. Accepts RAW observations;
// the score/band are computed by icu_scoring.js — any client apache_ii/sofa/gcs is IGNORED.

// ----- Fluid balance (intake/output) — icu_fluid_balance (server computes totals) -----

// ----- ICU board — ICU-bed patients + latest SOFA/GCS + vent status, sorted by acuity -----

// ===== CSSD =====
// ===== /API/CSSD (extracted -> routes/cssd.routes.js; behavior-preserving) =====
app.use(require('./routes/cssd.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e16, e16BeginTenantTx, e16RequireTenant }));

// ===== DIETARY =====
// ===== /API/DIETARY (extracted -> routes/dietary.routes.js; behavior-preserving) =====
app.use(require('./routes/dietary.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));
// ===== /API/NUTRITION (extracted -> routes/nutrition.routes.js; behavior-preserving) =====
app.use(require('./routes/nutrition.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));

// ===== INFECTION CONTROL (E17 HARDENED: tenant-scoped + RBAC) =====
// ===== /API/INFECTION (extracted -> routes/infection.routes.js; behavior-preserving) =====
app.use(require('./routes/infection.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e17RequireTenant, optionalReadFallback, E17_AMS_SEVERITY, E17_PRECAUTION_TYPES }));
// C2 FIX: outbreaks/exposures/hand-hygiene hardened — requireRole('infection') + requireTenantScope + fail-closed e17RequireTenant + tenant_id in every query + reported_by from session (L1).

// ===== E17 HAI isolation tracking =====

// ===== E17 Antimicrobial Stewardship (AMS) flags =====

// ===== QUALITY & PATIENT SAFETY (E17 HARDENED: tenant-scoped + RBAC + audit + state machine) =====
// confidential incidents are restricted to Admin / Quality Manager (RBAC-restricted PHI).
// ===== /API/QUALITY (extracted -> routes/quality.routes.js; behavior-preserving) =====
app.use(require('./routes/quality.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, e17CanSeeConfidential, e17ComputeRisk, e17IsValidCapaTransition, e17IsValidIncidentTransition, e17RequireTenant, optionalReadFallback, E17_CAPA_TYPES, E17_INCIDENT_HARM, E17_INCIDENT_SEVERITY, E17_INCIDENT_TYPES }));

// ===== E17 CAPA (corrective/preventive actions) — state machine + audit =====

// ===== E17 Risk Register (CBAHI indicators / score / trend) =====

// ===== MAINTENANCE =====
// ===== /API/MAINTENANCE (extracted -> routes/maintenance.routes.js; behavior-preserving) =====
app.use(require('./routes/maintenance.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));

// ===== PATIENT TRANSPORT =====
// ===== /API/TRANSPORT (extracted -> routes/transport.routes.js; behavior-preserving) =====
app.use(require('./routes/transport.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));

// ===== COSMETIC / PLASTIC SURGERY =====
// ===== /API/COSMETIC (extracted -> routes/cosmetic.routes.js; behavior-preserving) =====
app.use(require('./routes/cosmetic.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));
// Consent Forms
// Follow-ups

// ===== PATIENT PORTAL =====
// ===== /API/PORTAL (extracted -> routes/portal.routes.js; behavior-preserving) =====
app.use(require('./routes/portal.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, bcrypt }));

// ===== A1: PATIENT PORTAL — Lab Results, Medications, Visit Summary, Messages =====
// Portal endpoints secured with IDOR protection: patient_id must match tenant scope.

// GET /api/portal/lab-results?patient_id=X — نتائج المختبر للمريض عبر البوابة

// GET /api/portal/medications?patient_id=X — الأدوية الحالية للمريض

// GET /api/portal/visit-summary?patient_id=X — ملخص زيارات المريض

// GET /api/portal/messages?patient_id=X — رسائل المريض

// POST /api/portal/messages — إرسال رسالة من المريض للطاقم

// ===== A2: PEDIATRICS — Immunization Schedule (Saudi MOH National Immunization Program) =====

// GET /api/pediatrics/immunization-schedule — جدول التطعيمات الوطني السعودي

// GET /api/pediatrics/immunization-records/:patientId — سجلات التطعيم للمريض

// POST /api/pediatrics/immunization — تسجيل تطعيم جديد

// GET /api/pediatrics/weight-based-dose — حاسبة الجرعة حسب الوزن

// ===== A3: NURSING — Pain Assessment (NRS/VAS/FLACC) =====

// POST /api/nursing/pain-assessment — تسجيل تقييم الألم

// GET /api/nursing/pain-history/:patientId — تاريخ الألم للمريض

// ===== A4: ICU DAILY GOALS CHECKLIST (CBAHI Requirement) =====

// POST /api/icu/daily-goals — تسجيل أهداف اليوم للمريض ICU

// GET /api/icu/daily-goals/:admissionId — استرجاع أهداف اليوم

// ===== ZATCA E-INVOICING =====
// ===== E10 ZATCA PHASE-2 E-INVOICE (tenant-scoped, role-gated; clearance GATED off) =====
// generate => deterministic UBL 2.1 XML + TLV base64 QR + stamp PLACEHOLDER (no CSID => no real stamp).
// submit   => records intent only; when ZATCA_ENABLED is off the external call is stubbed 503.
// ===== /API/ZATCA (extracted -> routes/zatca.routes.js; behavior-preserving) =====
app.use(require('./routes/zatca.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, crypto, e10Err, e10IntId, e10RequireTenant, e10ZatcaEnabled, fe, idempotencyGuard, ZATCA_CREDIT_REASON_CODES }));



// ===== TELEMEDICINE =====
// ===== /API/TELEMEDICINE (extracted -> routes/telemedicine.routes.js; behavior-preserving) =====
app.use(require('./routes/telemedicine.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));

// ===== PATHOLOGY (legacy cases — hardened: tenant-scoped + RBAC + audit) =====
// Superseded by the E15 path_specimens workflow below; retained for back-compat
// but now tenant-isolated (was an unscoped cross-tenant leak).
// ===== /API/PATHOLOGY (extracted -> routes/pathology.routes.js; behavior-preserving) =====
app.use(require('./routes/pathology.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, pathologyEngine, optionalReadFallback }));

// ===== SOCIAL WORK =====
// ===== /API/SOCIAL-WORK (extracted -> routes/social-work.routes.js; behavior-preserving) =====
app.use(require('./routes/social-work.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));

// ===== MORTUARY =====
// ===== /API/MORTUARY (extracted -> routes/mortuary.routes.js; behavior-preserving) =====
app.use(require('./routes/mortuary.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));

// ===== CME =====
// ===== /API/CME (extracted -> routes/cme.routes.js; behavior-preserving) =====
app.use(require('./routes/cme.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));

// ===== eMAR =====
// ===== /API/EMAR (extracted -> routes/emar.routes.js; behavior-preserving) =====
app.use(require('./routes/emar.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));
// LEGACY eMAR documentation route. The PRIMARY nurse "Give" UI posts to the safe
// /api/mar/administer (server-enforced 5-rights + CDS + witness). To CLOSE the 5-rights bypass,
// this legacy route may ONLY document a NOT-given / held / refused dose — it can NEVER record an
// actual administration. Any attempt to record a "Given" event is rejected (410 MAR_USE_SAFE_PATH)
// and must go through /api/mar/administer. Role-gated, tenant-scoped, status FORCED 'Not Given',
// every write audited.

// ============================================================================
// E6 MAR — SAFE medication administration (server-enforced 5 RIGHTS + CDS + witness).
// POST /api/mar/administer  — the PRIMARY nurse "Give" path (NOT /api/emar/administrations).
//
// Fail-CLOSED security model. Every right is verified SERVER-SIDE against the authoritative
// prescription/order row (the client medication/dose/route strings are NEVER trusted):
//   Right Patient — the source row's patient_id must equal the submitted patient_id, and the
//                   patient must belong to this tenant. Mismatch => 422 MAR_WRONG_PATIENT.
//   Right Drug    — scanned drug barcode/name must match the prescribed medication. => MAR_WRONG_DRUG.
//   Right Dose    — administered dose must equal prescribed dose unless override_reason. => MAR_OVERRIDE_DOSE.
//   Right Route   — administered route must equal prescribed route unless override_reason. => MAR_OVERRIDE_ROUTE.
//   Right Time    — scheduled_at vs server clock within MAR_TIME_WINDOW_MIN; outside => override_reason. => MAR_OVERRIDE_TIME.
//   CDS           — cds.checkDrugAllergy + checkDrugDrugInteraction (server-derived active meds),
//                   fail-SAFE: an engine error becomes a WARNING (never a silent OK). A CRITICAL
//                   alert HARD-STOPS (422 MAR_CDS_BLOCK) unless override_reason (then audited).
//   Witness       — a high-alert drug (HIGH_ALERT list) requires a DISTINCT witness_user_id that is
//                   a real system_users row in the SAME tenant. else 422 MAR_WITNESS_REQUIRED (fail-closed).
// On success writes mar_administrations (tenant_id stamped; explicit AND tenant_id=$N on every query;
// null tenant => fail-closed) and audits MAR_ADMINISTRATION. Every blocked right/override is audited.
// ============================================================================
const MAR_TIME_WINDOW_MIN = 60; // tolerance (minutes) between scheduled_at and server clock
// High-alert medications (ISMP-style): administration requires an independent second-nurse witness.
const MAR_HIGH_ALERT = [
    'insulin', 'heparin', 'warfarin', 'morphine', 'hydromorphone', 'fentanyl', 'methadone',
    'oxycodone', 'potassium chloride', 'kcl', 'magnesium sulfate', 'digoxin', 'epinephrine',
    'norepinephrine', 'chemotherapy', 'methotrexate', 'insulin glargine', 'oxytocin',
];

// ===== /API/MAR (extracted -> routes/mar.routes.js; behavior-preserving) =====
app.use(require('./routes/mar.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, cds, getPatientActiveMeds, isHighAlertMed, MAR_TIME_WINDOW_MIN, marNorm }));

// ============================================================================
// E6 NURSING SCORES — POST /api/nursing/scores
// Accepts RAW observations and computes the score + band SERVER-SIDE via nursing_scores.js
// (the client can NEVER forge a "score"). Writes nursing_scores (tenant_id + explicit AND
// tenant_id predicate). Incomplete Braden (any missing subscale) => 422 (item 8, fail-closed).
// ============================================================================

// ===== NURSING CARE PLANS =====

// ===== GATE 2: EARLY-WARNING & SEPSIS SCREEN (stateless compute — no score persistence
// until the nursing_scores score_type CHECK is extended by the e48 candidate DDL) =====
// Computes MEWS (adult) / PEWS (pediatric) / qSOFA / SIRS / sepsis screen SERVER-SIDE from
// raw observations and returns the deterministic escalation recommendation. Client totals
// are never accepted. Advisory only — never a diagnosis. The request is audited (module
// EWS) so screening activity is traceable even before persistence lands.
// ===== /API/EWS (extracted -> routes/ews.routes.js; behavior-preserving) =====
app.use(require('./routes/ews.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, ewsEngine }));

// ===== FINANCIAL DAILY CLOSE =====

// ===== MEDICAL RECORDS / HIM =====

// ============================================================
// ===== E2 MEDICAL RECORDS / HIM =====
// Longitudinal record (access-logged), structured coding + deficiencies,
// ROI workflow, record-access-log read + break-glass.
// All endpoints: requireAuth + requireRole('him','medical-records') + requireTenantScope.
// Fail-closed: no tenant context in production -> 403 (requireTenantScope). New tables are
// tenant-scoped by FORCE RLS (app.tenant_id bound via AsyncLocalStorage) AND we stamp tenant_id
// from the session (never from body) for defense-in-depth. Optional sources (problems,
// clinical_notes, coding, access log) degrade gracefully if the table is absent (try/catch).
// ============================================================

// helper: append an event source without aborting the whole aggregation if a table is missing

// 1) LONGITUDINAL RECORD — aggregate the full chronological chart; EVERY access is logged.
// ===== /API/HIM (extracted -> routes/him.routes.js; behavior-preserving) =====
app.use(require('./routes/him.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, isHimOrAdmin, _himPushSource, optionalReadFallback }));

// 2) CODING — list / add structured codes for an encounter or patient.

// 2b) DEFICIENCIES — encounters/records missing required coding or signature.

// 3) ROI (Release of Information) — create / approve / deny / release. All audited; RBAC-guarded.

// STRICT server-side gate for the HIM audit surfaces (access-log + break-glass): ONLY the dedicated
// HIM role or Admin — NOT the broad 'medical-records'/'him' module (which Doctors also hold). The
// client tab is already gated to ['Admin','HIM']; this mirrors that check server-side (defense-in-depth).

// 4) RECORD ACCESS LOG (read) — HIM access audit, Admin/HIM only.

// 4b) BREAK-GLASS — emergency access: REQUIRES a reason, records break_glass access + raises BREAK_GLASS audit alert.

// ===== CLINICAL PHARMACY (E5: tenant-scoped for consistency with the rest of pharmacy) =====

// ===== OVR — INCIDENT REPORTS (بلاغات الحوادث — CBAHI Safety Culture) =====
// Auto-create table if not exists
(async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS incident_reports (
      id SERIAL PRIMARY KEY,
      tenant_id INTEGER,
      facility_id INTEGER,
      incident_type VARCHAR(100) NOT NULL,
      sac_classification VARCHAR(10) DEFAULT 'SAC4',
      incident_datetime TIMESTAMP,
      location VARCHAR(255),
      description TEXT,
      immediate_actions TEXT,
      is_anonymous BOOLEAN DEFAULT false,
      reporter_id INTEGER,
      reporter_name VARCHAR(255),
      status VARCHAR(50) DEFAULT 'Open',
      rca_status VARCHAR(100),
      rca_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`);
  } catch(e) { console.warn('[OVR] Table auto-create skipped:', e.message); }
})();

// ===== /API/INCIDENTS (extracted -> routes/incidents.routes.js; behavior-preserving) =====
app.use(require('./routes/incidents.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, canReviewOvr }));



// ===== ADMIN AUDIT LOG VIEWER =====
// ===== /API/ADMIN (extracted -> routes/admin.routes.js; behavior-preserving) =====
app.use(require('./routes/admin.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, canViewAdminAuditTrail, optionalReadFallback }));

// ===== REHABILITATION / PT =====
// ===== /API/REHAB (extracted -> routes/rehab.routes.js; behavior-preserving) =====
app.use(require('./routes/rehab.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));

// ===== DENTAL RECORDS =====
// ===== /API/DENTAL (extracted -> routes/dental.routes.js; behavior-preserving) =====
app.use(require('./routes/dental.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));

// ===== DENTAL PERIODONTAL EXAMS =====

// ===== DENTAL IMAGES & X-RAYS =====

// ===== CARDIOLOGY CATH LAB SIMULATOR =====

// ===== ONCOLOGY REGIMENS SIMULATOR =====
// ===== /API/ONCOLOGY (extracted -> routes/oncology.routes.js; behavior-preserving) =====
app.use(require('./routes/oncology.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ===== REHABILITATION ASSESSMENTS =====

// ===== MESSAGING =====

// ===== AUDIT TRAIL =====
// H-6: audit trail is a security log — restricted to system/security operators (settings module = IT/Admin),
// tenant-scoped with an explicit predicate (defense-in-depth atop FORCE RLS). No client tenant_id trusted.
// ===== /API/AUDIT-TRAIL (extracted -> routes/audit-trail.routes.js; behavior-preserving) =====
app.use(require('./routes/audit-trail.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));

// ===== PRINT API =====
// ===== /API/PRINT (extracted -> routes/print.routes.js; behavior-preserving) =====
app.use(require('./routes/print.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));



// ============================================================================
// ===== E18 — HR / WORKFORCE (employees PII, SCFHS licenses, shifts, attendance,
//        leave state machine, payroll-slip [GL posting GATED OFF]) =====
// All E18 tables provisioned out-of-band via candidate migration e18_01 (NOT in
//   db_postgres.js bootstrap). Every route: requireAuth + requireRole('hr') (HR+Admin)
//   + requireTenantScope + explicit AND tenant_id=$N on top of FORCE RLS. Mutations
//   stamped + logAudit. PII (salary/national_id) is HR/Admin-only; license expiry,
//   leave state, worked-hours and net pay are all computed SERVER-SIDE (anti-spoof).
// ============================================================================

// fail-CLOSED tenant resolver (mirrors e16RequireTenant): trusted session tenant or null.
// Dedicated-client tenant tx (pool.connect bypasses the patched pool.query wrapper, so
// app.tenant_id must be set explicitly for FORCE-RLS rows to be visible under FOR UPDATE).

// ---- LICENSES: list with SERVER-SIDE expiry classification (SCFHS alerts) ----

// ---- LICENSES: expiring/expired alert list (server-computed, on-demand) ----

// ---- LICENSES: create ----

// ---- SHIFTS: list ----

// ---- SHIFTS: create (server validates time + rejects overlap 409) ----

// ---- ATTENDANCE: clock-in/out (worked-hours computed SERVER-SIDE, never trusted) ----

// ---- LEAVE REQUESTS: list ----

// ---- LEAVE REQUESTS: create (status forced 'requested'; days computed server-side) ----

// ---- LEAVE REQUESTS: state transition (approve/deny/cancel) — 409 on invalid ----

// ---- PAYROLL SLIPS: list ----

// ---- PAYROLL SLIP: generate computed DRAFT slip (NET PAY computed SERVER-SIDE) ----
// No GL posting here. Slips are draft/computed only. Posting is a separate, GATED step.

// ---- PAYROLL SLIP: status transition. POSTING ('posted') is GATED OFF by flag (E10-style) ----

// ---- COMPETENCIES / CME: list + create (SCFHS compliance) ----


// SPA fallback
// [MOVED] catch-all to end of routes

// ===== INIT & START =====
try { app.use('/api/eng/tier145-ed-689', require('./tier145_ed_689_router.js')); } catch(e) { console.error('mount tier145_ed_689_router.js fail', e.message); }
try { app.use('/api/eng/tier145-nep-690', require('./tier145_nep_690_router.js')); } catch(e) { console.error('mount tier145_nep_690_router.js fail', e.message); }
try { app.use('/api/eng/tier145-pt-691', require('./tier145_pt_691_router.js')); } catch(e) { console.error('mount tier145_pt_691_router.js fail', e.message); }
try { app.use('/api/eng/tier145-cos-692', require('./tier145_cos_692_router.js')); } catch(e) { console.error('mount tier145_cos_692_router.js fail', e.message); }
try { app.use('/api/eng/tier146-ane-693', require('./tier146_ane_693_router.js')); } catch(e) { console.error('mount tier146_ane_693_router.js fail', e.message); }
try { app.use('/api/eng/tier146-hem-694', require('./tier146_hem_694_router.js')); } catch(e) { console.error('mount tier146_hem_694_router.js fail', e.message); }
try { app.use('/api/eng/tier146-neu-695', require('./tier146_neu_695_router.js')); } catch(e) { console.error('mount tier146_neu_695_router.js fail', e.message); }
try { app.use('/api/eng/tier146-irr-696', require('./tier146_irr_696_router.js')); } catch(e) { console.error('mount tier146_irr_696_router.js fail', e.message); }
try { app.use('/api/eng/tier147-rad-697', require('./tier147_rad_697_router.js')); } catch(e) { console.error('mount tier147_rad_697_router.js fail', e.message); }
try { app.use('/api/eng/tier147-pat-698', require('./tier147_pat_698_router.js')); } catch(e) { console.error('mount tier147_pat_698_router.js fail', e.message); }
try { app.use('/api/eng/tier147-pha-699', require('./tier147_pha_699_router.js')); } catch(e) { console.error('mount tier147_pha_699_router.js fail', e.message); }
try { app.use('/api/eng/tier147-pal-700', require('./tier147_pal_700_router.js')); } catch(e) { console.error('mount tier147_pal_700_router.js fail', e.message); }
try { app.use('/api/eng/tier148-onc-701', require('./tier148_onc_701_router.js')); } catch(e) { console.error('mount tier148_onc_701_router.js fail', e.message); }
try { app.use('/api/eng/tier148-obg-702', require('./tier148_obg_702_router.js')); } catch(e) { console.error('mount tier148_obg_702_router.js fail', e.message); }
try { app.use('/api/eng/tier148-nic-703', require('./tier148_nic_703_router.js')); } catch(e) { console.error('mount tier148_nic_703_router.js fail', e.message); }
try { app.use('/api/eng/tier148-bld-704', require('./tier148_bld_704_router.js')); } catch(e) { console.error('mount tier148_bld_704_router.js fail', e.message); }
try { app.use('/api/eng/tier149-car-705', require('./tier149_car_705_router.js')); } catch(e) { console.error('mount tier149_car_705_router.js fail', e.message); }
try { app.use('/api/eng/tier149-pul-706', require('./tier149_pul_706_router.js')); } catch(e) { console.error('mount tier149_pul_706_router.js fail', e.message); }
try { app.use('/api/eng/tier149-gi-707', require('./tier149_gi_707_router.js')); } catch(e) { console.error('mount tier149_gi_707_router.js fail', e.message); }
try { app.use('/api/eng/tier149-nep-708', require('./tier149_nep_708_router.js')); } catch(e) { console.error('mount tier149_nep_708_router.js fail', e.message); }
try { app.use('/api/eng/tier150-neu-709', require('./tier150_neu_709_router.js')); } catch(e) { console.error('mount tier150_neu_709_router.js fail', e.message); }
try { app.use('/api/eng/tier150-end-710', require('./tier150_end_710_router.js')); } catch(e) { console.error('mount tier150_end_710_router.js fail', e.message); }
try { app.use('/api/eng/tier150-rhe-711', require('./tier150_rhe_711_router.js')); } catch(e) { console.error('mount tier150_rhe_711_router.js fail', e.message); }
try { app.use('/api/eng/tier150-hem-712', require('./tier150_hem_712_router.js')); } catch(e) { console.error('mount tier150_hem_712_router.js fail', e.message); }
try { app.use('/api/eng/tier151-pls-713', require('./tier151_pls_713_router.js')); } catch(e) { console.error('mount tier151_pls_713_router.js fail', e.message); }
try { app.use('/api/eng/tier151-wou-714', require('./tier151_wou_714_router.js')); } catch(e) { console.error('mount tier151_wou_714_router.js fail', e.message); }
try { app.use('/api/eng/tier151-pod-715', require('./tier151_pod_715_router.js')); } catch(e) { console.error('mount tier151_pod_715_router.js fail', e.message); }
try { app.use('/api/eng/tier151-sle-716', require('./tier151_sle_716_router.js')); } catch(e) { console.error('mount tier151_sle_716_router.js fail', e.message); }
try { app.use('/api/eng/tier152-pdc-717', require('./tier152_pdc_717_router.js')); } catch(e) { console.error('mount tier152_pdc_717_router.js fail', e.message); }
try { app.use('/api/eng/tier152-pcs-718', require('./tier152_pcs_718_router.js')); } catch(e) { console.error('mount tier152_pcs_718_router.js fail', e.message); }
try { app.use('/api/eng/tier152-pgu-719', require('./tier152_pgu_719_router.js')); } catch(e) { console.error('mount tier152_pgu_719_router.js fail', e.message); }
try { app.use('/api/eng/tier152-chi-720', require('./tier152_chi_720_router.js')); } catch(e) { console.error('mount tier152_chi_720_router.js fail', e.message); }
try { app.use('/api/eng/tier153-pon-721', require('./tier153_pon_721_router.js')); } catch(e) { console.error('mount tier153_pon_721_router.js fail', e.message); }
try { app.use('/api/eng/tier153-bmt-722', require('./tier153_bmt_722_router.js')); } catch(e) { console.error('mount tier153_bmt_722_router.js fail', e.message); }
try { app.use('/api/eng/tier153-phem-723', require('./tier153_phem_723_router.js')); } catch(e) { console.error('mount tier153_phem_723_router.js fail', e.message); }
try { app.use('/api/eng/tier153-pic-724', require('./tier153_pic_724_router.js')); } catch(e) { console.error('mount tier153_pic_724_router.js fail', e.message); }
try { app.use('/api/eng/tier154-ent-725', require('./tier154_ent_725_router.js')); } catch(e) { console.error('mount tier154_ent_725_router.js fail', e.message); }
try { app.use('/api/eng/tier154-oms-728', require('./tier154_oms_728_router.js')); } catch(e) { console.error('mount tier154_oms_728_router.js fail', e.message); }
try { app.use('/api/eng/tier154-ort-729', require('./tier154_ort_729_router.js')); } catch(e) { console.error('mount tier154_ort_729_router.js fail', e.message); }
try { app.use('/api/eng/tier154-per-730', require('./tier154_per_730_router.js')); } catch(e) { console.error('mount tier154_per_730_router.js fail', e.message); }
try { app.use('/api/eng/tier155-spn-731', require('./tier155_spn_731_router.js')); } catch(e) { console.error('mount tier155_spn_731_router.js fail', e.message); }
try { app.use('/api/eng/tier155-spt-732', require('./tier155_spt_732_router.js')); } catch(e) { console.error('mount tier155_spt_732_router.js fail', e.message); }
try { app.use('/api/eng/tier155-pmn-733', require('./tier155_pmn_733_router.js')); } catch(e) { console.error('mount tier155_pmn_733_router.js fail', e.message); }
try { app.use('/api/eng/tier155-pmr-734', require('./tier155_pmr_734_router.js')); } catch(e) { console.error('mount tier155_pmr_734_router.js fail', e.message); }
try { app.use('/api/eng/tier156-crs-735', require('./tier156_crs_735_router.js')); } catch(e) { console.error('mount tier156_crs_735_router.js fail', e.message); }
try { app.use('/api/eng/tier156-hpb-736', require('./tier156_hpb_736_router.js')); } catch(e) { console.error('mount tier156_hpb_736_router.js fail', e.message); }
try { app.use('/api/eng/tier156-txp-737', require('./tier156_txp_737_router.js')); } catch(e) { console.error('mount tier156_txp_737_router.js fail', e.message); }
try { app.use('/api/eng/tier156-tra-738', require('./tier156_tra_738_router.js')); } catch(e) { console.error('mount tier156_tra_738_router.js fail', e.message); }
try { app.use('/api/eng/tier157-fm-739', require('./tier157_fm_739_router.js')); } catch(e) { console.error('mount tier157_fm_739_router.js fail', e.message); }
try { app.use('/api/eng/tier157-ger-740', require('./tier157_ger_740_router.js')); } catch(e) { console.error('mount tier157_ger_740_router.js fail', e.message); }
try { app.use('/api/eng/tier157-sm-741', require('./tier157_sm_741_router.js')); } catch(e) { console.error('mount tier157_sm_741_router.js fail', e.message); }
try { app.use('/api/eng/tier157-vac-742', require('./tier157_vac_742_router.js')); } catch(e) { console.error('mount tier157_vac_742_router.js fail', e.message); }
try { app.use('/api/eng/tier158-ivf-743', require('./tier158_ivf_743_router.js')); } catch(e) { console.error('mount tier158_ivf_743_router.js fail', e.message); }
try { app.use('/api/eng/tier158-and-744', require('./tier158_and_744_router.js')); } catch(e) { console.error('mount tier158_and_744_router.js fail', e.message); }
try { app.use('/api/eng/tier158-men-745', require('./tier158_men_745_router.js')); } catch(e) { console.error('mount tier158_men_745_router.js fail', e.message); }
try { app.use('/api/eng/tier158-mif-746', require('./tier158_mif_746_router.js')); } catch(e) { console.error('mount tier158_mif_746_router.js fail', e.message); }
try { app.use('/api/eng/tier159-hos-747', require('./tier159_hos_747_router.js')); } catch(e) { console.error('mount tier159_hos_747_router.js fail', e.message); }
try { app.use('/api/eng/tier159-cmp-748', require('./tier159_cmp_748_router.js')); } catch(e) { console.error('mount tier159_cmp_748_router.js fail', e.message); }
try { app.use('/api/eng/tier159-inv-749', require('./tier159_inv_749_router.js')); } catch(e) { console.error('mount tier159_inv_749_router.js fail', e.message); }
try { app.use('/api/eng/tier159-fin-750', require('./tier159_fin_750_router.js')); } catch(e) { console.error('mount tier159_fin_750_router.js fail', e.message); }
try { app.use('/api/eng/tier160-tel-751', require('./tier160_tel_751_router.js')); } catch(e) { console.error('mount tier160_tel_751_router.js fail', e.message); }
try { app.use('/api/eng/tier160-ai-752', require('./tier160_ai_752_router.js')); } catch(e) { console.error('mount tier160_ai_752_router.js fail', e.message); }
try { app.use('/api/eng/tier160-rs-753', require('./tier160_rs_753_router.js')); } catch(e) { console.error('mount tier160_rs_753_router.js fail', e.message); }
try { app.use('/api/eng/tier160-lab-754', require('./tier160_lab_754_router.js')); } catch(e) { console.error('mount tier160_lab_754_router.js fail', e.message); }
try { app.use('/api/eng/tier161-imu-755', require('./tier161_imu_755_router.js')); } catch(e) { console.error('mount tier161_imu_755_router.js fail', e.message); }
try { app.use('/api/eng/tier161-hem-756', require('./tier161_hem_756_router.js')); } catch(e) { console.error('mount tier161_hem_756_router.js fail', e.message); }
try { app.use('/api/eng/tier161-max-757', require('./tier161_max_757_router.js')); } catch(e) { console.error('mount tier161_max_757_router.js fail', e.message); }
try { app.use('/api/eng/tier161-pod-758', require('./tier161_pod_758_router.js')); } catch(e) { console.error('mount tier161_pod_758_router.js fail', e.message); }
try { app.use('/api/eng/tier162-pub-759', require('./tier162_pub_759_router.js')); } catch(e) { console.error('mount tier162_pub_759_router.js fail', e.message); }
try { app.use('/api/eng/tier162-prev-760', require('./tier162_prev_760_router.js')); } catch(e) { console.error('mount tier162_prev_760_router.js fail', e.message); }
try { app.use('/api/eng/tier162-occ-761', require('./tier162_occ_761_router.js')); } catch(e) { console.error('mount tier162_occ_761_router.js fail', e.message); }
try { app.use('/api/eng/tier162-avi-762', require('./tier162_avi_762_router.js')); } catch(e) { console.error('mount tier162_avi_762_router.js fail', e.message); }
try { app.use('/api/eng/tier163-aes-763', require('./tier163_aes_763_router.js')); } catch(e) { console.error('mount tier163_aes_763_router.js fail', e.message); }
try { app.use('/api/eng/tier163-div-764', require('./tier163_div_764_router.js')); } catch(e) { console.error('mount tier163_div_764_router.js fail', e.message); }
try { app.use('/api/eng/tier163-mar-765', require('./tier163_mar_765_router.js')); } catch(e) { console.error('mount tier163_mar_765_router.js fail', e.message); }
try { app.use('/api/eng/tier163-mil-766', require('./tier163_mil_766_router.js')); } catch(e) { console.error('mount tier163_mil_766_router.js fail', e.message); }
try { app.use('/api/eng/tier164-hum-767', require('./tier164_hum_767_router.js')); } catch(e) { console.error('mount tier164_hum_767_router.js fail', e.message); }
try { app.use('/api/eng/tier164-tel-768', require('./tier164_tel_768_router.js')); } catch(e) { console.error('mount tier164_tel_768_router.js fail', e.message); }
try { app.use('/api/eng/tier164-pal-769', require('./tier164_pal_769_router.js')); } catch(e) { console.error('mount tier164_pal_769_router.js fail', e.message); }
try { app.use('/api/eng/tier164-int-770', require('./tier164_int_770_router.js')); } catch(e) { console.error('mount tier164_int_770_router.js fail', e.message); }
try { app.use('/api/eng/tier165-gen-771', require('./tier165_gen_771_router.js')); } catch(e) { console.error('mount tier165_gen_771_router.js fail', e.message); }
try { app.use('/api/eng/tier165-phr-772', require('./tier165_phr_772_router.js')); } catch(e) { console.error('mount tier165_phr_772_router.js fail', e.message); }
try { app.use('/api/eng/tier165-bio-773', require('./tier165_bio_773_router.js')); } catch(e) { console.error('mount tier165_bio_773_router.js fail', e.message); }
try { app.use('/api/eng/tier165-eth-774', require('./tier165_eth_774_router.js')); } catch(e) { console.error('mount tier165_eth_774_router.js fail', e.message); }
try { app.use('/api/eng/tier166-cul-775', require('./tier166_cul_775_router.js')); } catch(e) { console.error('mount tier166_cul_775_router.js fail', e.message); }
try { app.use('/api/eng/tier166-psy-776', require('./tier166_psy_776_router.js')); } catch(e) { console.error('mount tier166_psy_776_router.js fail', e.message); }
try { app.use('/api/eng/tier166-den-777', require('./tier166_den_777_router.js')); } catch(e) { console.error('mount tier166_den_777_router.js fail', e.message); }
try { app.use('/api/eng/tier166-vis-778', require('./tier166_vis_778_router.js')); } catch(e) { console.error('mount tier166_vis_778_router.js fail', e.message); }
try { app.use('/api/eng/tier167-aud-779', require('./tier167_aud_779_router.js')); } catch(e) { console.error('mount tier167_aud_779_router.js fail', e.message); }
try { app.use('/api/eng/tier167-spe-780', require('./tier167_spe_780_router.js')); } catch(e) { console.error('mount tier167_spe_780_router.js fail', e.message); }
try { app.use('/api/eng/tier167-drm-781', require('./tier167_drm_781_router.js')); } catch(e) { console.error('mount tier167_drm_781_router.js fail', e.message); }
try { app.use('/api/eng/tier167-onc-782', require('./tier167_onc_782_router.js')); } catch(e) { console.error('mount tier167_onc_782_router.js fail', e.message); }
try { app.use('/api/eng/tier168-reh-783', require('./tier168_reh_783_router.js')); } catch(e) { console.error('mount tier168_reh_783_router.js fail', e.message); }
try { app.use('/api/eng/tier168-ped-784', require('./tier168_ped_784_router.js')); } catch(e) { console.error('mount tier168_ped_784_router.js fail', e.message); }
try { app.use('/api/eng/tier168-gyn-785', require('./tier168_gyn_785_router.js')); } catch(e) { console.error('mount tier168_gyn_785_router.js fail', e.message); }
try { app.use('/api/eng/tier168-obg-786', require('./tier168_obg_786_router.js')); } catch(e) { console.error('mount tier168_obg_786_router.js fail', e.message); }
try { app.use('/api/eng/tier169-icu-787', require('./tier169_icu_787_router.js')); } catch(e) { console.error('mount tier169_icu_787_router.js fail', e.message); }
try { app.use('/api/eng/tier169-emr-788', require('./tier169_emr_788_router.js')); } catch(e) { console.error('mount tier169_emr_788_router.js fail', e.message); }
try { app.use('/api/eng/tier169-tra-789', require('./tier169_tra_789_router.js')); } catch(e) { console.error('mount tier169_tra_789_router.js fail', e.message); }
try { app.use('/api/eng/tier169-cad-790', require('./tier169_cad_790_router.js')); } catch(e) { console.error('mount tier169_cad_790_router.js fail', e.message); }
try { app.use('/api/eng/tier170-nrs-791', require('./tier170_nrs_791_router.js')); } catch(e) { console.error('mount tier170_nrs_791_router.js fail', e.message); }
try { app.use('/api/eng/tier170-rad-792', require('./tier170_rad_792_router.js')); } catch(e) { console.error('mount tier170_rad_792_router.js fail', e.message); }
try { app.use('/api/eng/tier170-lab-793', require('./tier170_lab_793_router.js')); } catch(e) { console.error('mount tier170_lab_793_router.js fail', e.message); }
try { app.use('/api/eng/tier170-ane-794', require('./tier170_ane_794_router.js')); } catch(e) { console.error('mount tier170_ane_794_router.js fail', e.message); }

  app.use("/tier171_inf_795", require("./tier171_inf_795_router"));
  app.use("/tier171_emp_796", require("./tier171_emp_796_router"));
  app.use("/tier171_phr_797", require("./tier171_phr_797_router"));
  app.use("/tier171_qui_798", require("./tier171_qui_798_router"));
  app.use("/tier172_bun_799", require("./tier172_bun_799_router"));
  app.use("/tier172_car_805", require("./tier172_car_805_router"));
  app.use("/tier172_neu_802", require("./tier172_neu_802_router"));
  app.use("/tier172_bre_803", require("./tier172_bre_803_router"));
  app.use("/tier172_gyn_804", require("./tier172_gyn_804_router"));
  app.use("/tier173_pul_806", require("./tier173_pul_806_router"));
  app.use("/tier173_skp_807", require("./tier173_skp_807_router"));
  app.use("/tier173_mus_808", require("./tier173_mus_808_router"));
  app.use("/tier173_int_809", require("./tier173_int_809_router"));
  app.use("/tier173_ped_810", require("./tier173_ped_810_router"));
  app.use("/tier174_hem_811", require("./tier174_hem_811_router"));
  app.use("/tier174_onc_812", require("./tier174_onc_812_router"));
  app.use("/tier174_car_813", require("./tier174_car_813_router"));
  app.use("/tier174_nep_814", require("./tier174_nep_814_router"));
  app.use("/tier174_pal_815", require("./tier174_pal_815_router"));
  app.use("/tier175_eye_816", require("./tier175_eye_816_router"));
  app.use("/tier175_ent_817", require("./tier175_ent_817_router"));
  app.use("/tier175_ski_818", require("./tier175_ski_818_router"));
  app.use("/tier175_mus_819", require("./tier175_mus_819_router"));
  app.use("/tier175_psy_820", require("./tier175_psy_820_router"));

  app.use("/tier176_car_821", require("./tier176_car_821_router"));
  app.use("/tier176_onc_822", require("./tier176_onc_822_router"));
  app.use("/tier176_emr_823", require("./tier176_emr_823_router"));
  app.use("/tier176_lab_824", require("./tier176_lab_824_router"));
  app.use("/tier176_rad_825", require("./tier176_rad_825_router"));
  app.use("/tier177_ort_826", require("./tier177_ort_826_router"));
  app.use("/tier177_ent_827", require("./tier177_ent_827_router"));
  app.use("/tier177_eye_828", require("./tier177_eye_828_router"));
  app.use("/tier177_der_829", require("./tier177_der_829_router"));
  app.use("/tier177_rhe_830", require("./tier177_rhe_830_router"));
  app.use("/tier178_gi_831", require("./tier178_gi_831_router"));
  app.use("/tier178_end_832", require("./tier178_end_832_router"));
  app.use("/tier178_neu_833", require("./tier178_neu_833_router"));
  app.use("/tier178_psy_834", require("./tier178_psy_834_router"));
  app.use("/tier178_pal_835", require("./tier178_pal_835_router"));
  app.use("/tier179_uro_836", require("./tier179_uro_836_router"));
  app.use("/tier179_nep_837", require("./tier179_nep_837_router"));
  app.use("/tier179_pul_838", require("./tier179_pul_838_router"));
  app.use("/tier179_sle_839", require("./tier179_sle_839_router"));
  app.use("/tier179_all_840", require("./tier179_all_840_router"));
  app.use("/tier180_obg_841", require("./tier180_obg_841_router"));
  app.use("/tier180_ped_842", require("./tier180_ped_842_router"));
  app.use("/tier180_gen_843", require("./tier180_gen_843_router"));
  app.use("/tier180_sur_844", require("./tier180_sur_844_router"));
  app.use("/tier180_eme_845", require("./tier180_eme_845_router"));

  app.use("/tier181_cdi_846", require("./tier181_cdi_846_router"));
  app.use("/tier181_cdp_847", require("./tier181_cdp_847_router"));
  app.use("/tier181_cdt_848", require("./tier181_cdt_848_router"));
  app.use("/tier181_cdm_849", require("./tier181_cdm_849_router"));
  app.use("/tier181_cdx_850", require("./tier181_cdx_850_router"));
  app.use("/tier182_phl_851", require("./tier182_phl_851_router"));
  app.use("/tier182_phm_852", require("./tier182_phm_852_router"));
  app.use("/tier182_php_853", require("./tier182_php_853_router"));
  app.use("/tier182_phb_854", require("./tier182_phb_854_router"));
  app.use("/tier182_phg_855", require("./tier182_phg_855_router"));
  app.use("/tier183_imx_856", require("./tier183_imx_856_router"));
  app.use("/tier183_imc_857", require("./tier183_imc_857_router"));
  app.use("/tier183_imm_858", require("./tier183_imm_858_router"));
  app.use("/tier183_imu_859", require("./tier183_imu_859_router"));
  app.use("/tier183_imn_860", require("./tier183_imn_860_router"));
  app.use("/tier184_sx1_861", require("./tier184_sx1_861_router"));
  app.use("/tier184_sx2_862", require("./tier184_sx2_862_router"));
  app.use("/tier184_sx3_863", require("./tier184_sx3_863_router"));
  app.use("/tier184_sx4_864", require("./tier184_sx4_864_router"));
  app.use("/tier184_sx5_865", require("./tier184_sx5_865_router"));
  app.use("/tier185_rx1_866", require("./tier185_rx1_866_router"));
  app.use("/tier185_rx2_867", require("./tier185_rx2_867_router"));
  app.use("/tier185_rx3_868", require("./tier185_rx3_868_router"));
  app.use("/tier185_rx4_869", require("./tier185_rx4_869_router"));
  app.use("/tier185_rx5_870", require("./tier185_rx5_870_router"));

  app.use("/tier186_mt1_871", require("./tier186_mt1_871_router"));
  app.use("/tier186_mt2_872", require("./tier186_mt2_872_router"));
  app.use("/tier186_mt3_873", require("./tier186_mt3_873_router"));
  app.use("/tier186_mt4_874", require("./tier186_mt4_874_router"));
  app.use("/tier186_mt5_875", require("./tier186_mt5_875_router"));
  app.use("/tier187_ed1_876", require("./tier187_ed1_876_router"));
  app.use("/tier187_ed2_877", require("./tier187_ed2_877_router"));
  app.use("/tier187_ed3_878", require("./tier187_ed3_878_router"));
  app.use("/tier187_ed4_879", require("./tier187_ed4_879_router"));
  app.use("/tier187_ed5_880", require("./tier187_ed5_880_router"));
  app.use("/tier188_wh1_881", require("./tier188_wh1_881_router"));
  app.use("/tier188_wh2_882", require("./tier188_wh2_882_router"));
  app.use("/tier188_wh3_883", require("./tier188_wh3_883_router"));
  app.use("/tier188_wh4_884", require("./tier188_wh4_884_router"));
  app.use("/tier188_wh5_885", require("./tier188_wh5_885_router"));
  app.use("/tier189_ip1_886", require("./tier189_ip1_886_router"));
  app.use("/tier189_ip2_887", require("./tier189_ip2_887_router"));
  app.use("/tier189_ip3_888", require("./tier189_ip3_888_router"));
  app.use("/tier189_ip4_889", require("./tier189_ip4_889_router"));
  app.use("/tier189_ip5_890", require("./tier189_ip5_890_router"));
  app.use("/tier190_op1_891", require("./tier190_op1_891_router"));
  app.use("/tier190_op2_892", require("./tier190_op2_892_router"));
  app.use("/tier190_op3_893", require("./tier190_op3_893_router"));
  app.use("/tier190_op4_894", require("./tier190_op4_894_router"));
  app.use("/tier190_op5_895", require("./tier190_op5_895_router"));

  app.use("/tier191_rx1_896", require("./tier191_rx1_896_router"));
  app.use("/tier191_rx2_897", require("./tier191_rx2_897_router"));
  app.use("/tier191_rx3_898", require("./tier191_rx3_898_router"));
  app.use("/tier191_rx4_899", require("./tier191_rx4_899_router"));
  app.use("/tier191_rx5_900", require("./tier191_rx5_900_router"));
  app.use("/tier192_lx1_901", require("./tier192_lx1_901_router"));
  app.use("/tier192_lx2_902", require("./tier192_lx2_902_router"));
  app.use("/tier192_lx3_903", require("./tier192_lx3_903_router"));
  app.use("/tier192_lx4_904", require("./tier192_lx4_904_router"));
  app.use("/tier192_lx5_905", require("./tier192_lx5_905_router"));
  app.use("/tier193_dx1_906", require("./tier193_dx1_906_router"));
  app.use("/tier193_dx2_907", require("./tier193_dx2_907_router"));
  app.use("/tier193_dx3_908", require("./tier193_dx3_908_router"));
  app.use("/tier193_dx4_909", require("./tier193_dx4_909_router"));
  app.use("/tier193_dx5_910", require("./tier193_dx5_910_router"));
  app.use("/tier194_px1_911", require("./tier194_px1_911_router"));
  app.use("/tier194_px2_912", require("./tier194_px2_912_router"));
  app.use("/tier194_px3_913", require("./tier194_px3_913_router"));
  app.use("/tier194_px4_914", require("./tier194_px4_914_router"));
  app.use("/tier194_px5_915", require("./tier194_px5_915_router"));
  app.use("/tier195_qx1_916", require("./tier195_qx1_916_router"));
  app.use("/tier195_qx2_917", require("./tier195_qx2_917_router"));
  app.use("/tier195_qx3_918", require("./tier195_qx3_918_router"));
  app.use("/tier195_qx4_919", require("./tier195_qx4_919_router"));
  app.use("/tier195_qx5_920", require("./tier195_qx5_920_router"));

  app.use("/tier196_sx1_921", require("./tier196_sx1_921_router"));
  app.use("/tier196_sx2_922", require("./tier196_sx2_922_router"));
  app.use("/tier196_sx3_923", require("./tier196_sx3_923_router"));
  app.use("/tier196_sx4_924", require("./tier196_sx4_924_router"));
  app.use("/tier196_sx5_925", require("./tier196_sx5_925_router"));
  app.use("/tier197_mh1_926", require("./tier197_mh1_926_router"));
  app.use("/tier197_mh2_927", require("./tier197_mh2_927_router"));
  app.use("/tier197_mh3_928", require("./tier197_mh3_928_router"));
  app.use("/tier197_mh4_929", require("./tier197_mh4_929_router"));
  app.use("/tier197_mh5_930", require("./tier197_mh5_930_router"));
  app.use("/tier198_re1_931", require("./tier198_re1_931_router"));
  app.use("/tier198_re2_932", require("./tier198_re2_932_router"));
  app.use("/tier198_re3_933", require("./tier198_re3_933_router"));
  app.use("/tier198_re4_934", require("./tier198_re4_934_router"));
  app.use("/tier198_re5_935", require("./tier198_re5_935_router"));
  app.use("/tier199_pc1_936", require("./tier199_pc1_936_router"));
  app.use("/tier199_pc2_937", require("./tier199_pc2_937_router"));
  app.use("/tier199_pc3_938", require("./tier199_pc3_938_router"));
  app.use("/tier199_pc4_939", require("./tier199_pc4_939_router"));
  app.use("/tier199_pc5_940", require("./tier199_pc5_940_router"));
  app.use("/tier200_fn1_941", require("./tier200_fn1_941_router"));
  app.use("/tier200_fn2_942", require("./tier200_fn2_942_router"));
  app.use("/tier200_fn3_943", require("./tier200_fn3_943_router"));
  app.use("/tier200_fn4_944", require("./tier200_fn4_944_router"));
  app.use("/tier200_fn5_945", require("./tier200_fn5_945_router"));

  app.use("/tier201_ch1_946", require("./tier201_ch1_946_router"));
  app.use("/tier201_ch2_947", require("./tier201_ch2_947_router"));
  app.use("/tier201_ch3_948", require("./tier201_ch3_948_router"));
  app.use("/tier201_ch4_949", require("./tier201_ch4_949_router"));
  app.use("/tier201_ch5_950", require("./tier201_ch5_950_router"));
  app.use("/tier202_nu1_951", require("./tier202_nu1_951_router"));
  app.use("/tier202_nu2_952", require("./tier202_nu2_952_router"));
  app.use("/tier202_nu3_953", require("./tier202_nu3_953_router"));
  app.use("/tier202_nu4_954", require("./tier202_nu4_954_router"));
  app.use("/tier202_nu5_955", require("./tier202_nu5_955_router"));
  app.use("/tier203_sw1_956", require("./tier203_sw1_956_router"));
  app.use("/tier203_sw2_957", require("./tier203_sw2_957_router"));
  app.use("/tier203_sw3_958", require("./tier203_sw3_958_router"));
  app.use("/tier203_sw4_959", require("./tier203_sw4_959_router"));
  app.use("/tier203_sw5_960", require("./tier203_sw5_960_router"));
  app.use("/tier204_cp1_961", require("./tier204_cp1_961_router"));
  app.use("/tier204_cp2_962", require("./tier204_cp2_962_router"));
  app.use("/tier204_cp3_963", require("./tier204_cp3_963_router"));
  app.use("/tier204_cp4_964", require("./tier204_cp4_964_router"));
  app.use("/tier204_cp5_965", require("./tier204_cp5_965_router"));
  app.use("/tier205_ad1_966", require("./tier205_ad1_966_router"));
  app.use("/tier205_ad2_967", require("./tier205_ad2_967_router"));
  app.use("/tier205_ad3_968", require("./tier205_ad3_968_router"));
  app.use("/tier205_ad4_969", require("./tier205_ad4_969_router"));
  app.use("/tier205_ad5_970", require("./tier205_ad5_970_router"));

  app.use("/tier206_a1_946", require("./tier206_a1_946_router"));
  app.use("/tier206_a2_947", require("./tier206_a2_947_router"));
  app.use("/tier206_a3_948", require("./tier206_a3_948_router"));
  app.use("/tier206_a4_949", require("./tier206_a4_949_router"));
  app.use("/tier206_a5_950", require("./tier206_a5_950_router"));
  app.use("/tier207_b1_951", require("./tier207_b1_951_router"));
  app.use("/tier207_b2_952", require("./tier207_b2_952_router"));
  app.use("/tier207_b3_953", require("./tier207_b3_953_router"));
  app.use("/tier207_b4_954", require("./tier207_b4_954_router"));
  app.use("/tier207_b5_955", require("./tier207_b5_955_router"));
  app.use("/tier208_c1_956", require("./tier208_c1_956_router"));
  app.use("/tier208_c2_957", require("./tier208_c2_957_router"));
  app.use("/tier208_c3_958", require("./tier208_c3_958_router"));
  app.use("/tier208_c4_959", require("./tier208_c4_959_router"));
  app.use("/tier208_c5_960", require("./tier208_c5_960_router"));
  app.use("/tier209_d1_961", require("./tier209_d1_961_router"));
  app.use("/tier209_d2_962", require("./tier209_d2_962_router"));
  app.use("/tier209_d3_963", require("./tier209_d3_963_router"));
  app.use("/tier209_d4_964", require("./tier209_d4_964_router"));
  app.use("/tier209_d5_965", require("./tier209_d5_965_router"));
  app.use("/tier210_e1_966", require("./tier210_e1_966_router"));
  app.use("/tier210_e2_967", require("./tier210_e2_967_router"));
  app.use("/tier210_e3_968", require("./tier210_e3_968_router"));
  app.use("/tier210_e4_969", require("./tier210_e4_969_router"));
  app.use("/tier210_e5_970", require("./tier210_e5_970_router"));

  app.use("/tier211_a1_996", require("./tier211_a1_996_router"));
  app.use("/tier211_a2_997", require("./tier211_a2_997_router"));
  app.use("/tier211_a3_998", require("./tier211_a3_998_router"));
  app.use("/tier211_a4_999", require("./tier211_a4_999_router"));
  app.use("/tier211_a5_1000", require("./tier211_a5_1000_router"));
  app.use("/tier212_b1_1001", require("./tier212_b1_1001_router"));
  app.use("/tier212_b2_1002", require("./tier212_b2_1002_router"));
  app.use("/tier212_b3_1003", require("./tier212_b3_1003_router"));
  app.use("/tier212_b4_1004", require("./tier212_b4_1004_router"));
  app.use("/tier212_b5_1005", require("./tier212_b5_1005_router"));
  app.use("/tier213_c1_1006", require("./tier213_c1_1006_router"));
  app.use("/tier213_c2_1007", require("./tier213_c2_1007_router"));
  app.use("/tier213_c3_1008", require("./tier213_c3_1008_router"));
  app.use("/tier213_c4_1009", require("./tier213_c4_1009_router"));
  app.use("/tier213_c5_1010", require("./tier213_c5_1010_router"));
  app.use("/tier214_d1_1011", require("./tier214_d1_1011_router"));
  app.use("/tier214_d2_1012", require("./tier214_d2_1012_router"));
  app.use("/tier214_d3_1013", require("./tier214_d3_1013_router"));
  app.use("/tier214_d4_1014", require("./tier214_d4_1014_router"));
  app.use("/tier214_d5_1015", require("./tier214_d5_1015_router"));
  app.use("/tier215_e1_1016", require("./tier215_e1_1016_router"));
  app.use("/tier215_e2_1017", require("./tier215_e2_1017_router"));
  app.use("/tier215_e3_1018", require("./tier215_e3_1018_router"));
  app.use("/tier215_e4_1019", require("./tier215_e4_1019_router"));
  app.use("/tier215_e5_1020", require("./tier215_e5_1020_router"));

  app.use("/tier211_a1_996", require("./tier211_a1_996_router"));
  app.use("/tier211_a2_997", require("./tier211_a2_997_router"));
  app.use("/tier211_a3_998", require("./tier211_a3_998_router"));
  app.use("/tier211_a4_999", require("./tier211_a4_999_router"));
  app.use("/tier211_a5_1000", require("./tier211_a5_1000_router"));
  app.use("/tier212_b1_1001", require("./tier212_b1_1001_router"));
  app.use("/tier212_b2_1002", require("./tier212_b2_1002_router"));
  app.use("/tier212_b3_1003", require("./tier212_b3_1003_router"));
  app.use("/tier212_b4_1004", require("./tier212_b4_1004_router"));
  app.use("/tier212_b5_1005", require("./tier212_b5_1005_router"));
  app.use("/tier213_c1_1006", require("./tier213_c1_1006_router"));
  app.use("/tier213_c2_1007", require("./tier213_c2_1007_router"));
  app.use("/tier213_c3_1008", require("./tier213_c3_1008_router"));
  app.use("/tier213_c4_1009", require("./tier213_c4_1009_router"));
  app.use("/tier213_c5_1010", require("./tier213_c5_1010_router"));
  app.use("/tier214_d1_1011", require("./tier214_d1_1011_router"));
  app.use("/tier214_d2_1012", require("./tier214_d2_1012_router"));
  app.use("/tier214_d3_1013", require("./tier214_d3_1013_router"));
  app.use("/tier214_d4_1014", require("./tier214_d4_1014_router"));
  app.use("/tier214_d5_1015", require("./tier214_d5_1015_router"));
  app.use("/tier215_e1_1016", require("./tier215_e1_1016_router"));
  app.use("/tier215_e2_1017", require("./tier215_e2_1017_router"));
  app.use("/tier215_e3_1018", require("./tier215_e3_1018_router"));
  app.use("/tier215_e4_1019", require("./tier215_e4_1019_router"));
  app.use("/tier215_e5_1020", require("./tier215_e5_1020_router"));

  app.use("/tier216_a1_1021", require("./tier216_a1_1021_router"));
  app.use("/tier216_a2_1022", require("./tier216_a2_1022_router"));
  app.use("/tier216_a3_1023", require("./tier216_a3_1023_router"));
  app.use("/tier216_a4_1024", require("./tier216_a4_1024_router"));
  app.use("/tier216_a5_1025", require("./tier216_a5_1025_router"));
  app.use("/tier217_b1_1026", require("./tier217_b1_1026_router"));
  app.use("/tier217_b2_1027", require("./tier217_b2_1027_router"));
  app.use("/tier217_b3_1028", require("./tier217_b3_1028_router"));
  app.use("/tier217_b4_1029", require("./tier217_b4_1029_router"));
  app.use("/tier217_b5_1030", require("./tier217_b5_1030_router"));
  app.use("/tier218_c1_1031", require("./tier218_c1_1031_router"));
  app.use("/tier218_c2_1032", require("./tier218_c2_1032_router"));
  app.use("/tier218_c3_1033", require("./tier218_c3_1033_router"));
  app.use("/tier218_c4_1034", require("./tier218_c4_1034_router"));
  app.use("/tier218_c5_1035", require("./tier218_c5_1035_router"));
  app.use("/tier219_d1_1036", require("./tier219_d1_1036_router"));
  app.use("/tier219_d2_1037", require("./tier219_d2_1037_router"));
  app.use("/tier219_d3_1038", require("./tier219_d3_1038_router"));
  app.use("/tier219_d4_1039", require("./tier219_d4_1039_router"));
  app.use("/tier219_d5_1040", require("./tier219_d5_1040_router"));
  app.use("/tier220_e1_1041", require("./tier220_e1_1041_router"));
  app.use("/tier220_e2_1042", require("./tier220_e2_1042_router"));
  app.use("/tier220_e3_1043", require("./tier220_e3_1043_router"));
  app.use("/tier220_e4_1044", require("./tier220_e4_1044_router"));
  app.use("/tier220_e5_1045", require("./tier220_e5_1045_router"));

  app.use("/tier221_a1_1046", require("./tier221_a1_1046_router"));
  app.use("/tier221_a2_1047", require("./tier221_a2_1047_router"));
  app.use("/tier221_a3_1048", require("./tier221_a3_1048_router"));
  app.use("/tier221_a4_1049", require("./tier221_a4_1049_router"));
  app.use("/tier221_a5_1050", require("./tier221_a5_1050_router"));
  app.use("/tier222_b1_1051", require("./tier222_b1_1051_router"));
  app.use("/tier222_b2_1052", require("./tier222_b2_1052_router"));
  app.use("/tier222_b3_1053", require("./tier222_b3_1053_router"));
  app.use("/tier222_b4_1054", require("./tier222_b4_1054_router"));
  app.use("/tier222_b5_1055", require("./tier222_b5_1055_router"));
  app.use("/tier223_c1_1056", require("./tier223_c1_1056_router"));
  app.use("/tier223_c2_1057", require("./tier223_c2_1057_router"));
  app.use("/tier223_c3_1058", require("./tier223_c3_1058_router"));
  app.use("/tier223_c4_1059", require("./tier223_c4_1059_router"));
  app.use("/tier223_c5_1060", require("./tier223_c5_1060_router"));
  app.use("/tier224_d1_1061", require("./tier224_d1_1061_router"));
  app.use("/tier224_d2_1062", require("./tier224_d2_1062_router"));
  app.use("/tier224_d3_1063", require("./tier224_d3_1063_router"));
  app.use("/tier224_d4_1064", require("./tier224_d4_1064_router"));
  app.use("/tier224_d5_1065", require("./tier224_d5_1065_router"));
  app.use("/tier225_e1_1066", require("./tier225_e1_1066_router"));
  app.use("/tier225_e2_1067", require("./tier225_e2_1067_router"));
  app.use("/tier225_e3_1068", require("./tier225_e3_1068_router"));
  app.use("/tier225_e4_1069", require("./tier225_e4_1069_router"));
  app.use("/tier225_e5_1070", require("./tier225_e5_1070_router"));

  app.use("/tier226_a1_1071", require("./tier226_a1_1071_router"));
  app.use("/tier226_a2_1072", require("./tier226_a2_1072_router"));
  app.use("/tier226_a3_1073", require("./tier226_a3_1073_router"));
  app.use("/tier226_a4_1074", require("./tier226_a4_1074_router"));
  app.use("/tier226_a5_1075", require("./tier226_a5_1075_router"));
  app.use("/tier227_b1_1076", require("./tier227_b1_1076_router"));
  app.use("/tier227_b2_1077", require("./tier227_b2_1077_router"));
  app.use("/tier227_b3_1078", require("./tier227_b3_1078_router"));
  app.use("/tier227_b4_1079", require("./tier227_b4_1079_router"));
  app.use("/tier227_b5_1080", require("./tier227_b5_1080_router"));
  app.use("/tier228_c1_1081", require("./tier228_c1_1081_router"));
  app.use("/tier228_c2_1082", require("./tier228_c2_1082_router"));
  app.use("/tier228_c3_1083", require("./tier228_c3_1083_router"));
  app.use("/tier228_c4_1084", require("./tier228_c4_1084_router"));
  app.use("/tier228_c5_1085", require("./tier228_c5_1085_router"));
  app.use("/tier229_d1_1086", require("./tier229_d1_1086_router"));
  app.use("/tier229_d2_1087", require("./tier229_d2_1087_router"));
  app.use("/tier229_d3_1088", require("./tier229_d3_1088_router"));
  app.use("/tier229_d4_1089", require("./tier229_d4_1089_router"));
  app.use("/tier229_d5_1090", require("./tier229_d5_1090_router"));
  app.use("/tier230_e1_1091", require("./tier230_e1_1091_router"));
  app.use("/tier230_e2_1092", require("./tier230_e2_1092_router"));
  app.use("/tier230_e3_1093", require("./tier230_e3_1093_router"));
  app.use("/tier230_e4_1094", require("./tier230_e4_1094_router"));
  app.use("/tier230_e5_1095", require("./tier230_e5_1095_router"));

  app.use("/tier231_a1_1096", require("./tier231_a1_1096_router"));
  app.use("/tier231_a2_1097", require("./tier231_a2_1097_router"));
  app.use("/tier231_a3_1098", require("./tier231_a3_1098_router"));
  app.use("/tier231_a4_1099", require("./tier231_a4_1099_router"));
  app.use("/tier231_a5_1100", require("./tier231_a5_1100_router"));
  app.use("/tier232_b1_1101", require("./tier232_b1_1101_router"));
  app.use("/tier232_b2_1102", require("./tier232_b2_1102_router"));
  app.use("/tier232_b3_1103", require("./tier232_b3_1103_router"));
  app.use("/tier232_b4_1104", require("./tier232_b4_1104_router"));
  app.use("/tier232_b5_1105", require("./tier232_b5_1105_router"));
  app.use("/tier233_c1_1106", require("./tier233_c1_1106_router"));
  app.use("/tier233_c2_1107", require("./tier233_c2_1107_router"));
  app.use("/tier233_c3_1108", require("./tier233_c3_1108_router"));
  app.use("/tier233_c4_1109", require("./tier233_c4_1109_router"));
  app.use("/tier233_c5_1110", require("./tier233_c5_1110_router"));
  app.use("/tier234_d1_1111", require("./tier234_d1_1111_router"));
  app.use("/tier234_d2_1112", require("./tier234_d2_1112_router"));
  app.use("/tier234_d3_1113", require("./tier234_d3_1113_router"));
  app.use("/tier234_d4_1114", require("./tier234_d4_1114_router"));
  app.use("/tier234_d5_1115", require("./tier234_d5_1115_router"));
  app.use("/tier235_e1_1116", require("./tier235_e1_1116_router"));
  app.use("/tier235_e2_1117", require("./tier235_e2_1117_router"));
  app.use("/tier235_e3_1118", require("./tier235_e3_1118_router"));
  app.use("/tier235_e4_1119", require("./tier235_e4_1119_router"));
  app.use("/tier235_e5_1120", require("./tier235_e5_1120_router"));

  app.use("/tier236_a1_1121", require("./tier236_a1_1121_router"));
  app.use("/tier236_a2_1122", require("./tier236_a2_1122_router"));
  app.use("/tier236_a3_1123", require("./tier236_a3_1123_router"));
  app.use("/tier236_a4_1124", require("./tier236_a4_1124_router"));
  app.use("/tier236_a5_1125", require("./tier236_a5_1125_router"));
  app.use("/tier237_b1_1126", require("./tier237_b1_1126_router"));
  app.use("/tier237_b2_1127", require("./tier237_b2_1127_router"));
  app.use("/tier237_b3_1128", require("./tier237_b3_1128_router"));
  app.use("/tier237_b4_1129", require("./tier237_b4_1129_router"));
  app.use("/tier237_b5_1130", require("./tier237_b5_1130_router"));
  app.use("/tier238_c1_1131", require("./tier238_c1_1131_router"));
  app.use("/tier238_c2_1132", require("./tier238_c2_1132_router"));
  app.use("/tier238_c3_1133", require("./tier238_c3_1133_router"));
  app.use("/tier238_c4_1134", require("./tier238_c4_1134_router"));
  app.use("/tier238_c5_1135", require("./tier238_c5_1135_router"));
  app.use("/tier239_d1_1136", require("./tier239_d1_1136_router"));
  app.use("/tier239_d2_1137", require("./tier239_d2_1137_router"));
  app.use("/tier239_d3_1138", require("./tier239_d3_1138_router"));
  app.use("/tier239_d4_1139", require("./tier239_d4_1139_router"));
  app.use("/tier239_d5_1140", require("./tier239_d5_1140_router"));
  app.use("/tier240_e1_1141", require("./tier240_e1_1141_router"));
  app.use("/tier240_e2_1142", require("./tier240_e2_1142_router"));
  app.use("/tier240_e3_1143", require("./tier240_e3_1143_router"));
  app.use("/tier240_e4_1144", require("./tier240_e4_1144_router"));
  app.use("/tier240_e5_1145", require("./tier240_e5_1145_router"));

  app.use("/tier241_a1_1146", require("./tier241_a1_1146_router"));
  app.use("/tier241_a2_1147", require("./tier241_a2_1147_router"));
  app.use("/tier241_a3_1148", require("./tier241_a3_1148_router"));
  app.use("/tier241_a4_1149", require("./tier241_a4_1149_router"));
  app.use("/tier241_a5_1150", require("./tier241_a5_1150_router"));
  app.use("/tier242_b1_1151", require("./tier242_b1_1151_router"));
  app.use("/tier242_b2_1152", require("./tier242_b2_1152_router"));
  app.use("/tier242_b3_1153", require("./tier242_b3_1153_router"));
  app.use("/tier242_b4_1154", require("./tier242_b4_1154_router"));
  app.use("/tier242_b5_1155", require("./tier242_b5_1155_router"));
  app.use("/tier243_c1_1156", require("./tier243_c1_1156_router"));
  app.use("/tier243_c2_1157", require("./tier243_c2_1157_router"));
  app.use("/tier243_c3_1158", require("./tier243_c3_1158_router"));
  app.use("/tier243_c4_1159", require("./tier243_c4_1159_router"));
  app.use("/tier243_c5_1160", require("./tier243_c5_1160_router"));
  app.use("/tier244_d1_1161", require("./tier244_d1_1161_router"));
  app.use("/tier244_d2_1162", require("./tier244_d2_1162_router"));
  app.use("/tier244_d3_1163", require("./tier244_d3_1163_router"));
  app.use("/tier244_d4_1164", require("./tier244_d4_1164_router"));
  app.use("/tier244_d5_1165", require("./tier244_d5_1165_router"));
  app.use("/tier245_e1_1166", require("./tier245_e1_1166_router"));
  app.use("/tier245_e2_1167", require("./tier245_e2_1167_router"));
  app.use("/tier245_e3_1168", require("./tier245_e3_1168_router"));
  app.use("/tier245_e4_1169", require("./tier245_e4_1169_router"));
  app.use("/tier245_e5_1170", require("./tier245_e5_1170_router"));

  app.use("/tier246_a1_1171", require("./tier246_a1_1171_router"));
  app.use("/tier246_a2_1172", require("./tier246_a2_1172_router"));
  app.use("/tier246_a3_1173", require("./tier246_a3_1173_router"));
  app.use("/tier246_a4_1174", require("./tier246_a4_1174_router"));
  app.use("/tier246_a5_1175", require("./tier246_a5_1175_router"));
  app.use("/tier247_b1_1176", require("./tier247_b1_1176_router"));
  app.use("/tier247_b2_1177", require("./tier247_b2_1177_router"));
  app.use("/tier247_b3_1178", require("./tier247_b3_1178_router"));
  app.use("/tier247_b4_1179", require("./tier247_b4_1179_router"));
  app.use("/tier247_b5_1180", require("./tier247_b5_1180_router"));
  app.use("/tier248_c1_1181", require("./tier248_c1_1181_router"));
  app.use("/tier248_c2_1182", require("./tier248_c2_1182_router"));
  app.use("/tier248_c3_1183", require("./tier248_c3_1183_router"));
  app.use("/tier248_c4_1184", require("./tier248_c4_1184_router"));
  app.use("/tier248_c5_1185", require("./tier248_c5_1185_router"));
  app.use("/tier249_d1_1186", require("./tier249_d1_1186_router"));
  app.use("/tier249_d2_1187", require("./tier249_d2_1187_router"));
  app.use("/tier249_d3_1188", require("./tier249_d3_1188_router"));
  app.use("/tier249_d4_1189", require("./tier249_d4_1189_router"));
  app.use("/tier249_d5_1190", require("./tier249_d5_1190_router"));
  app.use("/tier250_e1_1191", require("./tier250_e1_1191_router"));
  app.use("/tier250_e2_1192", require("./tier250_e2_1192_router"));
  app.use("/tier250_e3_1193", require("./tier250_e3_1193_router"));
  app.use("/tier250_e4_1194", require("./tier250_e4_1194_router"));
  app.use("/tier250_e5_1195", require("./tier250_e5_1195_router"));

  app.use("/tier251_a1_1196", require("./tier251_a1_1196_router"));
  app.use("/tier251_a2_1197", require("./tier251_a2_1197_router"));
  app.use("/tier251_a3_1198", require("./tier251_a3_1198_router"));
  app.use("/tier251_a4_1199", require("./tier251_a4_1199_router"));
  app.use("/tier251_a5_1200", require("./tier251_a5_1200_router"));
  app.use("/tier252_b1_1201", require("./tier252_b1_1201_router"));
  app.use("/tier252_b2_1202", require("./tier252_b2_1202_router"));
  app.use("/tier252_b3_1203", require("./tier252_b3_1203_router"));
  app.use("/tier252_b4_1204", require("./tier252_b4_1204_router"));
  app.use("/tier252_b5_1205", require("./tier252_b5_1205_router"));
  app.use("/tier253_c1_1206", require("./tier253_c1_1206_router"));
  app.use("/tier253_c2_1207", require("./tier253_c2_1207_router"));
  app.use("/tier253_c3_1208", require("./tier253_c3_1208_router"));
  app.use("/tier253_c4_1209", require("./tier253_c4_1209_router"));
  app.use("/tier253_c5_1210", require("./tier253_c5_1210_router"));
  app.use("/tier254_d1_1211", require("./tier254_d1_1211_router"));
  app.use("/tier254_d2_1212", require("./tier254_d2_1212_router"));
  app.use("/tier254_d3_1213", require("./tier254_d3_1213_router"));
  app.use("/tier254_d4_1214", require("./tier254_d4_1214_router"));
  app.use("/tier254_d5_1215", require("./tier254_d5_1215_router"));
  app.use("/tier255_e1_1216", require("./tier255_e1_1216_router"));
  app.use("/tier255_e2_1217", require("./tier255_e2_1217_router"));
  app.use("/tier255_e3_1218", require("./tier255_e3_1218_router"));
  app.use("/tier255_e4_1219", require("./tier255_e4_1219_router"));
  app.use("/tier255_e5_1220", require("./tier255_e5_1220_router"));

  app.use("/tier256_a1_1221", require("./tier256_a1_1221_router"));
  app.use("/tier256_a2_1222", require("./tier256_a2_1222_router"));
  app.use("/tier256_a3_1223", require("./tier256_a3_1223_router"));
  app.use("/tier256_a4_1224", require("./tier256_a4_1224_router"));
  app.use("/tier256_a5_1225", require("./tier256_a5_1225_router"));
  app.use("/tier257_b1_1226", require("./tier257_b1_1226_router"));
  app.use("/tier257_b2_1227", require("./tier257_b2_1227_router"));
  app.use("/tier257_b3_1228", require("./tier257_b3_1228_router"));
  app.use("/tier257_b4_1229", require("./tier257_b4_1229_router"));
  app.use("/tier257_b5_1230", require("./tier257_b5_1230_router"));
  app.use("/tier258_c1_1231", require("./tier258_c1_1231_router"));
  app.use("/tier258_c2_1232", require("./tier258_c2_1232_router"));
  app.use("/tier258_c3_1233", require("./tier258_c3_1233_router"));
  app.use("/tier258_c4_1234", require("./tier258_c4_1234_router"));
  app.use("/tier258_c5_1235", require("./tier258_c5_1235_router"));
  app.use("/tier259_d1_1236", require("./tier259_d1_1236_router"));
  app.use("/tier259_d2_1237", require("./tier259_d2_1237_router"));
  app.use("/tier259_d3_1238", require("./tier259_d3_1238_router"));
  app.use("/tier259_d4_1239", require("./tier259_d4_1239_router"));
  app.use("/tier259_d5_1240", require("./tier259_d5_1240_router"));
  app.use("/tier260_e1_1241", require("./tier260_e1_1241_router"));
  app.use("/tier260_e2_1242", require("./tier260_e2_1242_router"));
  app.use("/tier260_e3_1243", require("./tier260_e3_1243_router"));
  app.use("/tier260_e4_1244", require("./tier260_e4_1244_router"));
  app.use("/tier260_e5_1245", require("./tier260_e5_1245_router"));

  app.use("/tier261_a1_1246", require("./tier261_a1_1246_router"));
  app.use("/tier261_a2_1247", require("./tier261_a2_1247_router"));
  app.use("/tier261_a3_1248", require("./tier261_a3_1248_router"));
  app.use("/tier261_a4_1249", require("./tier261_a4_1249_router"));
  app.use("/tier261_a5_1250", require("./tier261_a5_1250_router"));
  app.use("/tier262_b1_1251", require("./tier262_b1_1251_router"));
  app.use("/tier262_b2_1252", require("./tier262_b2_1252_router"));
  app.use("/tier262_b3_1253", require("./tier262_b3_1253_router"));
  app.use("/tier262_b4_1254", require("./tier262_b4_1254_router"));
  app.use("/tier262_b5_1255", require("./tier262_b5_1255_router"));
  app.use("/tier263_c1_1256", require("./tier263_c1_1256_router"));
  app.use("/tier263_c2_1257", require("./tier263_c2_1257_router"));
  app.use("/tier263_c3_1258", require("./tier263_c3_1258_router"));
  app.use("/tier263_c4_1259", require("./tier263_c4_1259_router"));
  app.use("/tier263_c5_1260", require("./tier263_c5_1260_router"));
  app.use("/tier264_d1_1261", require("./tier264_d1_1261_router"));
  app.use("/tier264_d2_1262", require("./tier264_d2_1262_router"));
  app.use("/tier264_d3_1263", require("./tier264_d3_1263_router"));
  app.use("/tier264_d4_1264", require("./tier264_d4_1264_router"));
  app.use("/tier264_d5_1265", require("./tier264_d5_1265_router"));
  app.use("/tier265_e1_1266", require("./tier265_e1_1266_router"));
  app.use("/tier265_e2_1267", require("./tier265_e2_1267_router"));
  app.use("/tier265_e3_1268", require("./tier265_e3_1268_router"));
  app.use("/tier265_e4_1269", require("./tier265_e4_1269_router"));
  app.use("/tier265_e5_1270", require("./tier265_e5_1270_router"));

  app.use("/tier266_a1_1271", require("./tier266_a1_1271_router"));
  app.use("/tier266_a2_1272", require("./tier266_a2_1272_router"));
  app.use("/tier266_a3_1273", require("./tier266_a3_1273_router"));
  app.use("/tier266_a4_1274", require("./tier266_a4_1274_router"));
  app.use("/tier266_a5_1275", require("./tier266_a5_1275_router"));
  app.use("/tier267_b1_1276", require("./tier267_b1_1276_router"));
  app.use("/tier267_b2_1277", require("./tier267_b2_1277_router"));
  app.use("/tier267_b3_1278", require("./tier267_b3_1278_router"));
  app.use("/tier267_b4_1279", require("./tier267_b4_1279_router"));
  app.use("/tier267_b5_1280", require("./tier267_b5_1280_router"));
  app.use("/tier268_c1_1281", require("./tier268_c1_1281_router"));
  app.use("/tier268_c2_1282", require("./tier268_c2_1282_router"));
  app.use("/tier268_c3_1283", require("./tier268_c3_1283_router"));
  app.use("/tier268_c4_1284", require("./tier268_c4_1284_router"));
  app.use("/tier268_c5_1285", require("./tier268_c5_1285_router"));
  app.use("/tier269_d1_1286", require("./tier269_d1_1286_router"));
  app.use("/tier269_d2_1287", require("./tier269_d2_1287_router"));
  app.use("/tier269_d3_1288", require("./tier269_d3_1288_router"));
  app.use("/tier269_d4_1289", require("./tier269_d4_1289_router"));
  app.use("/tier269_d5_1290", require("./tier269_d5_1290_router"));
  app.use("/tier270_e1_1291", require("./tier270_e1_1291_router"));
  app.use("/tier270_e2_1292", require("./tier270_e2_1292_router"));
  app.use("/tier270_e3_1293", require("./tier270_e3_1293_router"));
  app.use("/tier270_e4_1294", require("./tier270_e4_1294_router"));
  app.use("/tier270_e5_1295", require("./tier270_e5_1295_router"));

  app.use("/tier281_a1_1346", require("./tier281_a1_1346_router"));
  app.use("/tier281_a2_1347", require("./tier281_a2_1347_router"));
  app.use("/tier281_a3_1348", require("./tier281_a3_1348_router"));
  app.use("/tier281_a4_1349", require("./tier281_a4_1349_router"));
  app.use("/tier281_a5_1350", require("./tier281_a5_1350_router"));
  app.use("/tier282_b1_1351", require("./tier282_b1_1351_router"));
  app.use("/tier282_b2_1352", require("./tier282_b2_1352_router"));
  app.use("/tier282_b3_1353", require("./tier282_b3_1353_router"));
  app.use("/tier282_b4_1354", require("./tier282_b4_1354_router"));
  app.use("/tier282_b5_1355", require("./tier282_b5_1355_router"));
  app.use("/tier283_c1_1356", require("./tier283_c1_1356_router"));
  app.use("/tier283_c2_1357", require("./tier283_c2_1357_router"));
  app.use("/tier283_c3_1358", require("./tier283_c3_1358_router"));
  app.use("/tier283_c4_1359", require("./tier283_c4_1359_router"));
  app.use("/tier283_c5_1360", require("./tier283_c5_1360_router"));
  app.use("/tier284_d1_1361", require("./tier284_d1_1361_router"));
  app.use("/tier284_d2_1362", require("./tier284_d2_1362_router"));
  app.use("/tier284_d3_1363", require("./tier284_d3_1363_router"));
  app.use("/tier284_d4_1364", require("./tier284_d4_1364_router"));
  app.use("/tier284_d5_1365", require("./tier284_d5_1365_router"));
  app.use("/tier285_e1_1366", require("./tier285_e1_1366_router"));
  app.use("/tier285_e2_1367", require("./tier285_e2_1367_router"));
  app.use("/tier285_e3_1368", require("./tier285_e3_1368_router"));
  app.use("/tier285_e4_1369", require("./tier285_e4_1369_router"));
  app.use("/tier285_e5_1370", require("./tier285_e5_1370_router"));
  app.use("/tier286_f1_1371", require("./tier286_f1_1371_router"));
  app.use("/tier286_f2_1372", require("./tier286_f2_1372_router"));
  app.use("/tier286_f3_1373", require("./tier286_f3_1373_router"));
  app.use("/tier286_f4_1374", require("./tier286_f4_1374_router"));
  app.use("/tier286_f5_1375", require("./tier286_f5_1375_router"));
  app.use("/tier287_g1_1376", require("./tier287_g1_1376_router"));
  app.use("/tier287_g2_1377", require("./tier287_g2_1377_router"));
  app.use("/tier287_g3_1378", require("./tier287_g3_1378_router"));
  app.use("/tier287_g4_1379", require("./tier287_g4_1379_router"));
  app.use("/tier287_g5_1380", require("./tier287_g5_1380_router"));
  app.use("/tier288_h1_1381", require("./tier288_h1_1381_router"));
  app.use("/tier288_h2_1382", require("./tier288_h2_1382_router"));
  app.use("/tier288_h3_1383", require("./tier288_h3_1383_router"));
  app.use("/tier288_h4_1384", require("./tier288_h4_1384_router"));
  app.use("/tier288_h5_1385", require("./tier288_h5_1385_router"));
  app.use("/tier289_a1_1386", require("./tier289_a1_1386_router"));
  app.use("/tier289_a2_1387", require("./tier289_a2_1387_router"));
  app.use("/tier289_a3_1388", require("./tier289_a3_1388_router"));
  app.use("/tier289_a4_1389", require("./tier289_a4_1389_router"));
  app.use("/tier289_a5_1390", require("./tier289_a5_1390_router"));






async function startServer() {
    try {
        console.log('\n  🐘 Connecting to PostgreSQL...');
        await initDatabase();
        // Boot-time demo seed + catalog population run ONLY outside production. In production the
        // schema/catalogs already exist and the app runs as a non-superuser (nama_medical_app) that
        // lacks CREATE/seed rights, so running these here crashed the app ("permission denied for
        // schema public" / patients RLS violation). Production seed/schema is managed out-of-band
        // (see docs/sql/boot_time_schema_cleanup_candidate_*). Tenant binding is unaffected.
        // SKIP_DB_INIT accepts '1'/'true'/'yes' (matches db_postgres). Tests spawn with SKIP_DB_INIT:'1';
        // the old !== 'true' check let '1' through and ran insertSampleData() -> patients RLS violation
        // (no app.tenant_id on a restored/production-like DB). Skip seed whenever init is skipped.
        const _skipSeed = ['1', 'true', 'yes'].includes(String(process.env.SKIP_DB_INIT || '').toLowerCase());
        const _allowSeed = (process.env.NODE_ENV !== 'staging' && process.env.NODE_ENV !== 'production') || process.env.ALLOW_STAGING_SEED === 'true';
        if (_allowSeed && !_skipSeed) {
            await insertSampleData();
            await populateLabCatalog();
            await populateRadiologyCatalog();
            await addExtraLabTests();
            await addExtraRadiology();
            await populateMedicalServices();
            await populateBaseDrugs();
        } else {
            console.log('[DB INFO] Skipping demo seed + catalog population.');
        }
        













































// Auto-mount generated tier routers (290-310): path = '/' + file base name
for (const f of require('fs').readdirSync(__dirname).sort()) {
  if (!/^tier(?:29\d|30\d|31\d)_\w+_\d+_router\.js$/.test(f)) continue;
  try { app.use('/' + f.replace(/_router\.js$/, ''), require('./' + f)); }
  catch(e) { console.error('mount ' + f + ' fail', e.message); }
}

app.listen(PORT, () => {
            console.log(`\n  ✅ jumanaMedical Web is running!`);
            console.log(`  🌐 Open: http://localhost:${PORT}`);
            console.log(`  📦 Database: PostgreSQL (nama_medical_web)\n`);
        });
    } catch (err) {
        console.error('  ❌ Failed to start:', err.message);
        process.exit(1);
    }
}

// ===== PHARMACY & PRESCRIPTIONS =====
// CRITICAL-1 helper: derive the patient's CURRENT active medications from AUTHORITATIVE server-side
// sources (never the client body), scoped to patient + tenant. Sources:
//   1) pharmacy_prescriptions_queue rows not yet dispensed/cancelled (medication_name).
//   2) active/pending med-type orders (orders.type='med' -> order_items.catalog_ref) via the E-X tables.
// Returns a de-duplicated array of drug-name strings. RLS also enforces tenant isolation; the explicit
// tenant_id predicate is defense-in-depth. Caller treats a thrown error as FAIL-SAFE (warns, never skips).

// Doctor sends prescription → Pharmacy queue

// Get pharmacy prescriptions queue

// Update prescription status (Dispense with sale)

// Get drug catalog

// Add drug to catalog

// ============================================================================
// ===== E5 PHARMACY: FEFO BATCHES + PHARMACIST VERIFICATION + DISPENSE + CONTROLLED DRUGS =====
// Builds on E1 cds.js (REUSED — no duplicated matrix). CLINICAL-SAFETY: FAIL-CLOSED.
// Rules enforced here:
//   - FEFO: dispense from the earliest NON-EXPIRED batch first; NEVER from an expired batch;
//     insufficient on-hand across valid batches => 409 (no partial silent dispense).
//   - VERIFY: pharmacist re-runs the E1 CDS engine (allergy + dose + drug-drug) against the
//     patient's active meds queried SERVER-SIDE (getPatientActiveMeds — never trust client).
//     A CRITICAL alert HARD-STOPS (422) unless override_reason is supplied (then AUDITED).
//   - CONTROLLED: dispensing a controlled/high-alert drug REQUIRES a second witness id; missing
//     witness => 422 (fail-closed). A double-entry controlled_drug_log row records balance before/after.
//   - Every query carries an explicit tenant_id predicate (defense-in-depth on top of FORCE RLS);
//     null tenant in production is already blocked by requireTenantScope (fail-closed).
// ============================================================================

// Transaction helper: a SINGLE dedicated client with app.tenant_id bound for the WHOLE transaction.
// The patched pool.query binds tenant per-call only, so multi-statement RLS transactions must set
// app.tenant_id themselves on the client. Fail-closed: a null tenantId here means NO binding => RLS
// (FORCE) yields zero rows, so the transaction cannot touch any tenant's data.

// --- GET pharmacy stock view: per-drug on-hand (sum of batches) + low-stock / near-expiry flags ---

// --- POST receive a drug batch (FEFO lot) ---

// --- PUT pharmacist VERIFY: re-run E1 CDS engine (allergy + dose + drug-drug) at the pharmacist checkpoint ---
// Active meds are derived SERVER-SIDE (getPatientActiveMeds) — never trusted from the client (E1 CRITICAL-2 lesson).

// --- POST FEFO DISPENSE (by barcode or drug_id): single transaction, decrements earliest non-expired batch first ---
// Requires the queue item to be 'Verified'. Controlled drugs require a witness (fail-closed).

// --- Wasfaty / NPHIES coverage stub (gated; NO external call) ---
// Behind WASFATY_ENABLED. Records coverage INTENT only — never opens a real connection.

// ===== P&L REPORT =====

// ===== COMPREHENSIVE DIAGNOSIS TEMPLATES (80+ diagnoses, 12 specialties) =====
// ===== /API/DIAGNOSIS-TEMPLATES (extracted -> routes/diagnosis-templates.routes.js; behavior-preserving) =====
app.use(require('./routes/diagnosis-templates.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));

// ===== SAFE PATIENT DELETE (soft delete if has records) =====

// ===== PHARMACY STOCK DEDUCTION ON DISPENSE =====

// ===== DRUG EXPIRY ALERTS (E5: FEFO-accurate, repointed to drug_batches DATE per lot) =====

// ===== INVOICE CANCEL (Credit Note) =====

// ===== APPOINTMENT CONFLICT CHECK =====

// ===== NOTIFICATIONS =====
// ===== /API/NOTIFICATIONS (extracted -> routes/notifications.routes.js; behavior-preserving) =====
app.use(require('./routes/notifications.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ===== VISIT TRACKING =====
// ===== /API/VISITS (extracted -> routes/visits.routes.js; behavior-preserving) =====
app.use(require('./routes/visits.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));


// ===== AUDIT TRAIL VIEWER =====


// ===== STOCK MOVEMENT LOG =====

// ===== NURSING ASSESSMENT SCALES =====

// ===== BACKUP ENDPOINT =====


// ============================================================================
// ===== OB/GYN / MATERNITY DEPARTMENT (Epic E14) =====
// HARDENED: every route requires auth + RBAC(obgyn/antenatal) + requireTenantScope.
// Every query carries an explicit `AND tenant_id=$N` on top of FORCE RLS. Patient /
// pregnancy / delivery ownership is verified against the caller's tenant; cross-tenant
// access returns 404 (never leak existence). Authority fields (EDD, GA, GPAL living,
// APGAR total, biometry GA/percentile, risk flags) are computed SERVER-SIDE via
// ob_engine (anti-spoof — client-submitted values are ignored). Delivery is gated by a
// server-side state machine (Active -> Delivered only) with SELECT ... FOR UPDATE.
// IDs are compared as integers (parseInt + Number.isInteger), never string-coerced.
// ============================================================================

// e14RequireTenant — fail-closed tenant resolver for OB routes. Returns an integer
// tenantId or null; callers MUST treat null as "block" (no unscoped fallback in prod).

// Verify a patient belongs to the caller's tenant. Returns the integer id or null.
// Load a tenant-owned pregnancy row (or null). Used for ownership + state checks.


// Pregnancy Records — list (tenant-scoped; integer-validated filters)

// SHADOWED/DEAD: an earlier app.post('/api/obgyn/pregnancies', ...) (~line 5123) is
// registered first, so Express never routes here. Kept for reference until the OB endpoints
// are consolidated onto a single handler+schema (tracked as a Wave-2 schema-conflict item);
// the effective handler above was hardened to accept this route's payload shape too.


// Antenatal Visits — read (verify pregnancy ownership first)


// ===== PARTOGRAM (labor progression trend; tenant-scoped) =====


// Ultrasound Records — biometry -> GA/percentile computed server-side


// Delivery Records — state machine (Active -> Delivered) + SELECT...FOR UPDATE; server APGAR


// ===== NEONATAL RECORD (attached 1:1 to a delivery; APGAR computed server-side) =====


// NST Records

// OB/GYN Lab Panels (tenant-scoped catalog)

// OB/GYN Dashboard Stats — fail-closed tenant scoping (HR#1: null tenant -> 403, no unscoped fallback)


// ===== CONSENT FORMS =====
// ===== /API/CONSENT (extracted -> routes/consent.routes.js; behavior-preserving) =====
app.use(require('./routes/consent.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, optionalReadFallback }));






// ===== DAILY CASH RECONCILIATION =====

// ===== DOCTOR REVENUE + COMMISSIONS =====

// ===== AGING REPORT (30/60/90/120 days) =====

// ===== REFERRAL SYSTEM =====


// ===== ENHANCED DASHBOARD STATS (today KPIs) =====

// ===== PATIENT FULL SUMMARY (for Doctor) =====


// ===== MEDICAL REPORTS & SICK LEAVE =====
// ===== /API/MEDICAL-REPORTS (extracted -> routes/medical-reports.routes.js; behavior-preserving) =====
app.use(require('./routes/medical-reports.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));




// ===== DRUG INTERACTION CHECK =====
// ===== /API/DRUG-INTERACTIONS (extracted -> routes/drug-interactions.routes.js; behavior-preserving) =====
app.use(require('./routes/drug-interactions.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, cds }));

// ===== ALLERGY CROSS-CHECK =====
// ===== /API/ALLERGY-CHECK (extracted -> routes/allergy-check.routes.js; behavior-preserving) =====
app.use(require('./routes/allergy-check.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));

// ===== PARTIAL PAYMENT & REFUND =====
// H-1: partial payment — amount validated server-side (fail-closed), outstanding computed from DB,
// no overpayment, row-locked transaction (race-safe), tenant-scoped + RLS-bound under the manual client.

// H-2: refund — original invoice MUST belong to current tenant (IDOR fix), amount validated server-side,
// refundable = amount_paid - already-refunded (server-computed, tenant-scoped), refund row stamped with
// tenant_id/facility_id, row-locked transaction. No GL/journal/ZATCA/NPHIES (out of scope).

// ===== CASH DRAWER =====
// ===== /API/CASH-DRAWER (extracted -> routes/cash-drawer.routes.js; behavior-preserving) =====
app.use(require('./routes/cash-drawer.routes.js')({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }));




// ===== VISIT LIFECYCLE TRACKING =====



// ===== APPOINTMENT CHECK-IN =====

// ===== NO-SHOW MARKING =====

// ===== DUPLICATE APPOINTMENT PREVENTION =====

// ===== LAB REFERENCE RANGES =====

// ===== NURSING: TRIAGE + PAIN SCORE =====

// ===== DOCTOR: NEXT PATIENT =====

// ===== DOCTOR: MY QUEUE =====


// ===== PASSWORD CHANGE =====


// ===== DASHBOARD CHARTS DATA =====


// ===== DATABASE BACKUP (Admin only) =====



// ===== FINANCE SUMMARY =====

// ===== INVENTORY LOW STOCK =====

// ===== MEDICAL RECORDS BY PATIENT =====



// ===== PATHOLOGY SPECIMENS (E15 — tenant-scoped, RBAC, server-authoritative state machine) =====
// Hierarchy: path_specimens -> path_blocks -> path_slides ; path_reports (1:1 per specimen).
// Reads: pathology/lab/doctor. Writes: pathology/lab. Sign-out/addendum: pathology only.

// LIST specimens (tenant-scoped). Returns rows for the session tenant only; null tenant -> [].

// GET one specimen with blocks + slides + report (tenant-scoped; IDOR -> 404).

// CREATE specimen — accession server-generated; patient validated same-tenant (IDOR -> 404).

// ADD block to specimen (tenant-scoped; specimen must be same-tenant -> 404 else).

// ADD slide to a block (validates block + specimen same-tenant chain).

// STATE transition — server-authoritative; invalid -> 409. SignedOut is terminal.

// SAVE report draft (gross/micro/diagnosis/SNOMED). Blocked once SignedOut (addendum-only).

// SIGN-OUT — pathologist only; final transition Reported -> SignedOut; locks report.

// ADDENDUM — only after sign-out; append-only, never edits the signed report body.

// LEGACY GUARD: old client called PUT /api/pathology/specimens/:id { status:'completed' }.
// That bypassed the state machine. It is now rewired to a 409 telling clients to use /state.

// ===== CSSD BATCHES =====

// ===== CME EVENTS =====

// ===== INFECTION CONTROL REPORTS =====
// C1 FIX: /api/infection-control/reports hardened — requireRole('infection') + requireTenantScope + fail-closed e17RequireTenant + tenant_id in every query.
// The primary UI path now calls /api/infection/surveillance (window.reportInfection); this legacy route is retained read-only for resolveIc and is fully guarded.

// ===== MAINTENANCE ORDERS =====

// ===== INSURANCE POLICIES (moved into the E11 INSURANCE / NPHIES block above — tenant-scoped) =====

// ===== INVENTORY ITEMS =====

// ===== PHARMACY PRESCRIPTIONS =====

// E-X1 unified orders mounted additively using the requirePermission declared above.
mountOrderRoutes(app, { pool, requireAuth, requireTenantScope, getRequestTenantContext, logAudit, requirePermission });

// ===== SaaS Batch 1: Tenant Control Center / Super Admin (additive, flag-gated) =====
// Inert unless SUPER_ADMIN_ENABLED=true. Identity = ENV allowlist SUPER_ADMIN_USERS (platform grant,
// NOT a tenant role) -> no privilege escalation. Per-tenant stats read inside that tenant's RLS context.
if (process.env.SUPER_ADMIN_ENABLED === 'true') {
    const { makeSuperAdminRouter } = require('./super_admin');
    // Unified outer guard (Batch 2): the shared requireSuperAdmin enforces the SAME env-allowlist identity
    // as super_admin.js's internal guard (defense-in-depth, single identity source). Fail-closed.
    app.use('/api/super-admin', requireAuth, requireSuperAdmin(process.env.SUPER_ADMIN_USERS), makeSuperAdminRouter({
        pool,
        requireAuth,
        getActor: (req) => req.session && req.session.user,
        runWithTenant: (tenantId, fn) => tenantStore.run({ tenantId }, fn),
        logAudit,
        allowlist: process.env.SUPER_ADMIN_USERS,
        enabled: true
    }));
    // ===== SaaS Batch 3: Plans & Pricing admin (same /api/super-admin mount + same requireSuperAdmin guard) =====
    const { makePlansRouter } = require('./plans');
    app.use('/api/super-admin', requireAuth, requireSuperAdmin(process.env.SUPER_ADMIN_USERS), makePlansRouter({
        pool,
        getActor: (req) => req.session && req.session.user,
        logAudit
    }));
}

// ===== SaaS Batch 3: public read-only active plans (no auth; marketing-safe fields; [] if catalog absent) =====
const { makePublicPlansRouter } = require('./plans');
app.use('/api/public', makePublicPlansRouter({ pool }));

// ===== Plans public alias under /api/v1 namespace (added 2026-07-29, additive) =====
// Re-mounts the SAME public-plans router at /api/v1/plans and /api/v1/plans/list.
// No auth (mirrors /api/public/plans). Same marketing-safe fields, same empty-on-missing
// catalog behavior. Closes the /api/v1/plans/list 404 gap.
const plansPublicAlias = require('./plans_public_alias');
app.use('/api/v1/plans', plansPublicAlias);

// ===== NPHIES v1 API stubs under /api/v1/nphies (added 2026-07-29, additive) =====
// Sandbox-mode stubs (NPHIES_ENV=sandbox by default). requireAuth is applied here for
// defense-in-depth even though the stubs are read-only. PRODUCTION (real CSID/OTP) must
// add makeIdempotencyGuard + requireTenantScope on the money/claim routes and swap
// each stub body for a real HTTP call into the existing ./nphies_client.js NphiesClient.
const nphiesV1 = require('./nphies_v1_stub');
app.use('/api/v1/nphies', requireAuth, nphiesV1);

// ===== CLINICAL CALCULATOR ROUTERS — Phase 2E2 (18 fns) + Phase 3 (48 fns across 26 engines) =====
// Both routers are READ-ONLY clinical decision-support: no DB writes, no PHI, no PII.
// requireAuth + requireTenantScope are applied INSIDE each router (router-level middleware).
// Engine throws on validation error => translated to 400 with code='engine_error'.
// Phase 2E2 lives at /api/calculators/*; Phase 3 (26 new engines) lives at /api/phase3/*.
const { makeCalculatorsRouter } = require('./clinical_calculators_router');
app.use('/api/calculators', makeCalculatorsRouter({ requireAuth, requireTenantScope }));

const { makePhase3CalculatorsRouter } = require('./phase3_calculators_router');
app.use('/api/phase3', makePhase3CalculatorsRouter({ requireAuth, requireTenantScope }));

// ===== Phase 3 Wave 5-8 (Batch 2): 47 new clinical engines from the Phase 3 Week bundle =====
// Mounted at /api/phase3/v2/* to avoid shadowing the 26 endpoints in the legacy router.
const { makePhase3V2Router } = require('./phase3_v2_calculators_router');
app.use('/api/phase3/v2', makePhase3V2Router({ requireAuth, requireTenantScope }));

// ===== FHIR R4 Public Surface (additive 2026-08-03, RAIL-5) =====
// Mounted at /fhir/*. Tenant scoping is enforced INSIDE the router via
// lib/route-guards (requireTenant + requireTenantScope, fail-closed).
// No new global middleware — purely additive `app.use('/fhir', ...)`.
app.use('/fhir', require('./routes/fhir_router'));

// ===== SaaS Batch 4A: Entitlements Runtime Resolver — OBSERVE-ONLY read surface, flag-gated =====
// Inert unless ENTITLEMENTS_ENABLED=true (zero behavior change otherwise). No creation point is gated.
// Read-only: Super Admin views the RESOLVED entitlements for a tenant. Fail-open if e25 catalog is absent.
if (process.env.ENTITLEMENTS_ENABLED === 'true') {
    const { makeEntitlementsResolver, pickEnforcement } = require('./entitlements');
    const entResolver = makeEntitlementsResolver({ pool, logAudit });
    const entCfg = pickEnforcement(process.env);
    app.get('/api/super-admin/tenants/:id/entitlements', requireAuth, requireSuperAdmin(process.env.SUPER_ADMIN_USERS), async (req, res) => {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Invalid tenant id' });
        try {
            const r = await entResolver.resolveTenantEntitlements(id);
            res.json({ tenant_id: id, enforcement_mode: entCfg.mode, source: r.source, plan_key: r.plan_key, entitlements: r.entitlements, reason: r.reason });
        } catch (e) { res.status(500).json({ error: 'Server error' }); }
    });
    console.log('[ENTITLEMENTS] resolver mounted (observe read; mode=' + entCfg.mode + ')');
}

// ===== BOOT-TIME COLUMN MIGRATIONS (non-production only) =====
// These additive ALTERs ran on every boot and silently swallowed errors. They require
// table-owner/DDL rights the production app role (nama_medical_app) lacks. Disabled in
// production and managed out-of-band (see docs/sql/boot_time_schema_cleanup_candidate_*).
if (process.env.NODE_ENV !== 'production') {
    // MIGRATION: Add last_ip column to system_users
    (async () => { try { await pool.query(`DO $$ BEGIN ALTER TABLE system_users ADD COLUMN last_ip TEXT DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END $$;`); } catch (e) { } })();
    // MIGRATION: Add failed_login_attempts and lockout_until columns to system_users
    (async () => {
        try {
            await pool.query(`DO $$ BEGIN ALTER TABLE system_users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0; EXCEPTION WHEN duplicate_column THEN NULL; END $$;`);
            await pool.query(`DO $$ BEGIN ALTER TABLE system_users ADD COLUMN lockout_until TIMESTAMP WITH TIME ZONE DEFAULT NULL; EXCEPTION WHEN duplicate_column THEN NULL; END $$;`);
        } catch (e) { }
    })();
    // MIGRATION: Add doctor column to pharmacy_prescriptions_queue
    (async () => { try { await pool.query(`DO $$ BEGIN ALTER TABLE pharmacy_prescriptions_queue ADD COLUMN doctor TEXT DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END $$;`); } catch (e) { } })();
    // MIGRATION: Fix audit_trail schema (add user_name and details columns)
    (async () => {
        try {
            await pool.query(`DO $$ BEGIN ALTER TABLE audit_trail ADD COLUMN user_name TEXT DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END $$;`);
            await pool.query(`DO $$ BEGIN ALTER TABLE audit_trail ADD COLUMN details TEXT DEFAULT ''; EXCEPTION WHEN duplicate_column THEN NULL; END $$;`);
        } catch (e) { }
    })();
}


// ===== E1 DOCTOR STATION ROUTES (additive; mounted BEFORE the SPA catch-all) =====
// Problem List + SOAP clinical notes + CDS-gated CPOE (orders via the E-X unified `orders` table).
// requirePermission (rbac.js / E-X2) is optional and not present on main yet -> guards fall back to
// requireAuth + requireTenantScope + requireRole('doctor'). cds is the pure FAIL-SAFE engine.
mountClinicalRoutes(app, {
    pool,
    requireAuth,
    requireTenantScope,
    getRequestTenantContext,
    logAudit,
    requireRole,
    requirePermission: (typeof requirePermission === 'function' ? requirePermission : undefined),
    cds,
});

// ============================================================================
// ===== E16 — INVENTORY / SUPPLY CHAIN + CSSD (batches, PO, GRN, movements,
//        transactional no-negative stock, CSSD biological-indicator gate) =====
// All tables provisioned out-of-band via candidate migrations e16_01/e16_02/e16_03
//   (NOT in db_postgres.js bootstrap). Every route: requireAuth + requireRole + tenant scope
//   + explicit AND tenant_id=$N on top of FORCE RLS. Mutations stamped + logAudit.
// ============================================================================

// fail-CLOSED tenant resolver (mirrors e7/e8/e9RequireTenant convention): returns the
// trusted session tenant or null; callers MUST 403 on null in production. Never invents a tenant.
function e16RequireTenant(req) {
    const { tenantId, facilityId, isProduction } = getRequestTenantContext(req);
    if (!tenantId) {
        if (isProduction) return { ok: false };           // fail-closed: no unscoped fallback in prod
        return { ok: false };                              // dev: getRequestTenantContext already injects 1; null here => still block
    }
    return { ok: true, tenantId, facilityId };
}

// Transactionally bind app.tenant_id on a DEDICATED client (the patched pool.query wrapper does
// NOT cover a client obtained via pool.connect(), so FORCE-RLS rows would be invisible without
// this). SET LOCAL scopes the setting to the surrounding transaction only.
async function e16BeginTenantTx(tenantId) {
    const client = await pool.connect();
    await client.query('BEGIN');
    await client.query("SELECT set_config('app.tenant_id', $1, true)", [String(tenantId)]);
    return client;
}

async function checkAndTriggerAutoReorder(itemId, tenantId, client) {
    const db = client || pool;
    try {
        const item = (await db.query(
            'SELECT item_name, stock_qty, reorder_point, min_qty FROM inventory_items WHERE id=$1 AND tenant_id=$2',
            [itemId, tenantId]
        )).rows[0];
        if (item) {
            const rp = (item.reorder_point && item.reorder_point > 0) ? item.reorder_point : item.min_qty;
            const isLow = item.stock_qty <= (rp || 10);
            if (isLow) {
                const existing = (await db.query(
                    "SELECT id FROM notifications WHERE module='Inventory' AND record_id=$1 AND type='warning' AND is_read=0 AND tenant_id=$2",
                    [itemId, tenantId]
                )).rows[0];
                if (!existing) {
                    await db.query(
                        `INSERT INTO notifications (title, title_ar, message, body, body_ar, type, module, record_id, target_role, tenant_id)
                         VALUES ($1, $2, $3, $3, $4, $5, $6, $7, $8, $9)`,
                        [
                            `Low Stock Alert: ${item.item_name}`,
                            `تنبيه انخفاض المخزون: ${item.item_name}`,
                            `Item "${item.item_name}" is below safety stock level. Current quantity: ${item.stock_qty}.`,
                            `الصنف "${item.item_name}" أقل من حد الأمان. الكمية الحالية: ${item.stock_qty}.`,
                            'warning',
                            'Inventory',
                            itemId,
                            'Inventory Manager',
                            tenantId
                        ]
                    );
                    console.log(`[Auto-Reorder Engine] Triggered low-stock alert for item #${itemId} (${item.item_name})`);
                }
            }
        }
    } catch (err) {
        console.error(`[Auto-Reorder Engine] Failed to check low-stock alert for item #${itemId}:`, err);
    }
}


// ---- inventory items: low-stock by reorder_point (engine classification) ----

// ---- batches: list per item / create (FEFO source of truth) ----

// ---- purchase orders: create (draft) ----

// ---- purchase orders: state transition (approve / cancel) — server-side state machine ----

// ---- GRN: receive goods against an approved/partially-received PO (TRANSACTIONAL) ----
// Increments stock by creating a batch + a 'receive' movement per line, advances PO line/header
// state, all in one transaction. Receiving only valid from approved/partially_received (else 409).

// ---- stock movement: issue / adjust / transfer (TRANSACTIONAL, no-negative, FEFO) ----
// The server is authoritative on the movement sign — a client cannot turn an 'issue' into a
// stock-increasing op. Decrements are FEFO across batches and blocked (409) if insufficient.

// ---- stock movements ledger (read) ----

// ---- periodic stock count / reconciliation (records variance; optional adjust movement) ----

// ============================================================================
// ===== E16 — CSSD biological-indicator (BI) gate (fail-CLOSED) =====
// A cycle's BI result is recorded server-side; a cycle/tray can only be RELEASED for sterile
// issue when the BI is an explicit recorded PASS. The client cannot self-assert 'Pass'.
// ============================================================================

// record the BI / CI result for a cycle (does NOT itself release — that is a separate gated step)

// THE GATE: release a completed cycle's load for sterile issue — fail-CLOSED on BI.

// CSSD trays: list / create (packed) ----

// issue a STERILE tray to OR/ward — fail-CLOSED: only a tray already 'sterile' may be issued.
// ===== END E16 ROUTES =====

// ============================================================================
// ===== DYNAMIC EMR ENGINE ROUTES (Phase 1) =====
// ============================================================================

// 1. GET /api/clinical/departments - List all clinical departments

// 2. POST /api/clinical/departments - Create clinical department (Admin only)

// 3. GET /api/clinical/templates - List templates

// 4. POST /api/clinical/templates - Create/Update template (Admin only)

// 5. GET /api/clinical/records - List patient EMR records

// 6. POST /api/clinical/records - Save EMR record (insert/update)

// EMR lock/signature is unified and handled at the top route definition (line 4141) to support both tables and enforce clinical role boundaries.

// Phase F2: SOAP Clinical Notes Endpoints



// Phase F2: Clinical Smart Templates (Dot Phrases) Endpoints



// Phase F3: ICU Prevention Bundles & Infection Control Endpoints


// ===== SaaS Billing Webhooks (Moyasar & Stripe) =====
async function assignTenantPlanHelper(tenantId, planKey, source, assignedBy = null) {
    // 1. Check if plan exists
    const plan = (await pool.query('SELECT 1 FROM plans WHERE plan_key = $1', [planKey])).rows[0];
    if (!plan) throw new Error(`Plan ${planKey} not found`);

    // 2. Terminate active assignment
    await pool.query('UPDATE tenant_plan_assignments SET effective_to = CURRENT_TIMESTAMP WHERE tenant_id = $1 AND effective_to IS NULL', [tenantId]);

    // 3. Create new assignment
    await pool.query(
        'INSERT INTO tenant_plan_assignments (tenant_id, plan_key, assignment_source, assigned_by, effective_from) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)',
        [tenantId, planKey, source, assignedBy]
    );
}

// Moyasar Webhook

// Stripe Webhook


// ===== PHASE B: SAUDI COMPLIANCE (B1: NPHIES Remittance, B2: ZATCA Credit Notes, B3: HR Saudi) =====

// ─── B1: NPHIES REMITTANCE ADVICE ───────────────────────────────────────────
// GET /api/nphies/remittance — list remittance advice records

// POST /api/nphies/remittance — record a remittance advice (manual or from NPHIES response)

// POST /api/nphies/remittance/:id/post-to-ar — post remittance to AR (Accounts Receivable) and GL

// POST /api/nphies/claim-status-inquiry — FHIR Task-based claim status inquiry (gated)

// GET /api/nphies/remittance/summary — dashboard summary

// ─── B2: ZATCA CREDIT NOTES ─────────────────────────────────────────────────

// GET /api/zatca/credit-notes — list credit notes

// POST /api/zatca/credit-note — generate credit note for an invoice

// POST /api/zatca/credit-note/:id/submit — submit credit note to ZATCA (gated)

// GET /api/zatca/invoice-chain — verify hash chain integrity

// ─── B3a: HR CREDENTIALING & PRIVILEGING ────────────────────────────────────
// GET /api/hr/credentialing — list credentials

// GET /api/hr/credentialing/alerts — expiring soon

// POST /api/hr/credentialing — add credential

// PUT /api/hr/credentialing/:id/verify — verify credential

// ─── B3b: GOSI INTEGRATION ──────────────────────────────────────────────────
// GET /api/hr/gosi — list GOSI records

// POST /api/hr/gosi/calculate — calculate GOSI contributions for a month

// GET /api/hr/gosi/summary/:month — monthly GOSI summary

// ─── B3c: WPS — WAGE PROTECTION SYSTEM ─────────────────────────────────────
// GET /api/hr/wps — list WPS files

// POST /api/hr/wps/generate — generate SIF file for a payroll month

// PUT /api/hr/wps/:id/submit — mark WPS file as submitted

// ─── B3d: NITAQAT / SAUDIZATION ─────────────────────────────────────────────
// GET /api/hr/nitaqat — get latest Nitaqat snapshot

// POST /api/hr/nitaqat/calculate — calculate current Saudization %


// ===== PHASE C: CLINICAL QUALITY (C1: Controlled Substances, C2: Med Rec, C3: Micro/LOINC, C4: Problem List/ICD-10) =====

// ─── C1: CONTROLLED SUBSTANCES ──────────────────────────────────────────────



// ─── C2: MEDICATION RECONCILIATION ──────────────────────────────────────────


// ─── C3: LAB MICROBIOLOGY & LOINC ───────────────────────────────────────────



// ─── C4: PROBLEM LIST & ICD-10 ──────────────────────────────────────────────




async function ensureCOAAccount(tenantId, code, nameEn, nameAr, accountClass, client) {
    const db = client || pool;
    const cleanCode = String(code).trim();
    let normalizedClass = accountClass;
    if (accountClass) {
        const lower = accountClass.toLowerCase();
        if (lower === 'asset') normalizedClass = 'Asset';
        else if (lower === 'liability') normalizedClass = 'Liability';
        else if (lower === 'equity') normalizedClass = 'Equity';
        else if (lower === 'revenue') normalizedClass = 'Revenue';
        else if (lower === 'expense') normalizedClass = 'Expense';
    }
    const existing = (await db.query(
        'SELECT id FROM finance_chart_of_accounts WHERE tenant_id = $1 AND account_code = $2',
        [tenantId, cleanCode]
    )).rows[0];
    if (existing) {
        return existing.id;
    }
    const res = await db.query(
        `INSERT INTO finance_chart_of_accounts 
            (account_code, account_name_en, account_name_ar, parent_id, account_type, account_class, tenant_id)
         VALUES ($1, $2, $3, 0, $4, $4, $5) RETURNING id`,
        [cleanCode, nameEn, nameAr, normalizedClass, tenantId]
    );
    return res.rows[0].id;
}

async function postTransactionToGL(tenantId, entryNumber, description, reference, sourceType, lines, client) {
    const db = client || pool;
    const entry = (await db.query(
        `INSERT INTO finance_journal_entries 
            (entry_number, entry_date, description, reference, source_type, posting_status, is_posted, created_by, posted_by, posted_at, balanced_at, tenant_id)
         VALUES ($1, CURRENT_DATE::TEXT, $2, $3, $4, 'POSTED', 1, 'System', NULL, now(), now(), $5) RETURNING id`,
        [entryNumber, description, reference, sourceType, tenantId]
    )).rows[0];

    for (const line of lines) {
        await db.query(
            `INSERT INTO finance_journal_lines (entry_id, account_id, debit, credit, cost_center_id, notes, tenant_id)
             VALUES ($1, $2, $3, $4, NULL, $5, $6)`,
            [entry.id, line.accountId, line.debit, line.credit, line.notes || '', tenantId]
        );
    }
    return entry.id;
}

// ===== PHASE D: FINANCE & OPERATIONS (D1: AP/AR, D2: Vendors, D3: Financial snapshots) =====

// ─── D1: ACCOUNTS PAYABLE & RECEIVABLE ──────────────────────────────────────






// ─── D2: VENDORS ────────────────────────────────────────────────────────────
// ===== /API/VENDORS (extracted -> routes/vendors.routes.js; behavior-preserving) =====
app.use(require('./routes/vendors.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ─── D3: FINANCIAL REPORTS SNAPSHOTS ────────────────────────────────────────



// ===== PHASE E: INTEGRATION & AI (E1: FHIR Resources, E2: HL7 Messages, E3: AI CDS & Voice) =====

// ─── E1: FHIR RESOURCE STORE ────────────────────────────────────────────────
// ===== /API/FHIR (extracted -> routes/fhir.routes.js; behavior-preserving) =====
app.use(require('./routes/fhir.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ─── E2: HL7 MESSAGE LOG ────────────────────────────────────────────────────
// ===== /API/HL7 (extracted -> routes/hl7.routes.js; behavior-preserving) =====
app.use(require('./routes/hl7.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// ─── E3: AI CLINICAL DECISION SUPPORT & VOICE ───────────────────────────────



// ===== PHASE F1: WORLD-CLASS CLINICAL QUALITY ENDPOINTS =====

// POST /api/clinical/safety-check — فحص تعارض الأدوية وحساسية المريض

// POST /api/nursing/risk-assessment — تسجيل تقييم خطورة Braden Scale أو Morse Fall Risk

// GET /api/nursing/risk-assessments/:patientId — استرجاع تقييمات الخطورة للمريض

// GET /api/nursing/risk-assessments — استرجاع كافة تقييمات الخطورة للمستأجر الحالي

// POST /api/surgery/count-sheet — تسجيل جرد الأدوات الجراحية والشاش

// GET /api/surgery/count-sheet/:surgeryId — استرجاع جرد الأدوات للجراحة

// POST /api/pediatrics/apgar — تسجيل نقاط تقييم أبغار للمولود

// GET /api/pediatrics/apgar/:patientId — استرجاع نقاط تقييم أبغار للمولود



// ===== NURSING STATION EXTENSIONS (v1) =====
// Auto-provision visit_lifecycle table (fixes production error: relation does not exist)
async function ensureVisitLifecycleTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS visit_lifecycle (
                id SERIAL PRIMARY KEY,
                tenant_id INTEGER,
                patient_id INTEGER,
                patient_name VARCHAR(255),
                appointment_id INTEGER,
                doctor VARCHAR(255),
                department VARCHAR(255),
                status VARCHAR(64) DEFAULT 'arrived',
                arrived_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                with_nurse_at TIMESTAMPTZ,
                with_doctor_at TIMESTAMPTZ,
                discharged_at TIMESTAMPTZ,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_visit_lifecycle_patient ON visit_lifecycle(patient_id)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_visit_lifecycle_date ON visit_lifecycle(created_at)`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_visit_lifecycle_tenant ON visit_lifecycle(tenant_id)`);
        console.log('[NS] visit_lifecycle table ensured ✅');
    } catch (e) { console.warn('[NS] visit_lifecycle ensure:', e.message); }
}

// Auto-provision nursing_io table
async function ensureNursingIOTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS nursing_io (
                id SERIAL PRIMARY KEY,
                tenant_id INTEGER,
                patient_id INTEGER,
                entry_type VARCHAR(32) NOT NULL CHECK (entry_type IN ('intake','output')),
                source VARCHAR(128) NOT NULL,
                volume_ml INTEGER NOT NULL DEFAULT 0,
                entry_time VARCHAR(10),
                shift VARCHAR(64),
                nurse_name VARCHAR(255),
                notes TEXT DEFAULT '',
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_nursing_io_patient ON nursing_io(patient_id)`);
        console.log('[NS] nursing_io table ensured ✅');
    } catch (e) { console.warn('[NS] nursing_io ensure:', e.message); }
}

// Auto-provision nursing_handover table
async function ensureNursingHandoverTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS nursing_handover (
                id SERIAL PRIMARY KEY,
                tenant_id INTEGER,
                patient_id INTEGER,
                nurse_name VARCHAR(255),
                shift VARCHAR(64),
                sbar_s TEXT DEFAULT '',
                sbar_b TEXT DEFAULT '',
                sbar_a TEXT DEFAULT '',
                sbar_r TEXT DEFAULT '',
                news2_score INTEGER DEFAULT 0,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_nursing_handover_patient ON nursing_handover(patient_id)`);
        console.log('[NS] nursing_handover table ensured ✅');
    } catch (e) { console.warn('[NS] nursing_handover ensure:', e.message); }
}

// Run table provisioning on startup
Promise.all([ensureVisitLifecycleTable(), ensureNursingIOTable(), ensureNursingHandoverTable()])
    .then(() => console.log('[NS] All nursing extension tables ready ✅'))
    .catch(e => console.warn('[NS] Table setup warning:', e.message));

// ===== I&O: GET — get all entries for a patient =====

// ===== I&O: POST — add entry =====

// ===== Handover SBAR: GET =====

// ===== Handover SBAR: POST =====

// ===== DEVICE CALIBRATIONS (معايرة الأجهزة الطبية) =====


// ===== MEDICAL WASTE LOGS (تتبع النفايات الطبية الخطرة) =====
// ===== /API/SAFETY (extracted -> routes/safety.routes.js; behavior-preserving) =====
app.use(require('./routes/safety.routes.js')({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }));


// AUTO-MOUNT: dept_api_v4 (P3-E v6 owner-flagged) — reuses pg pool + session from main app
try {
  app.use('/api/v4/dept', require('./routes/dept_router'));
// ===== autowire_all_v23 (2026-08-03) — 28 routers =====
try { (function(){var _m=require("./routes/fhir_router");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/fhir",_r);}else{console.warn('[autowire] /fhir skipped: no router');}})(); } catch (e) { console.warn('[autowire] /fhir skipped:', e.message); }
try { (function(){var _m=require("./routes/careplans");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/careplans",_r);}else{console.warn('[autowire] /api/v4/careplans skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/careplans skipped:', e.message); }
try { (function(){var _m=require("./routes/discharge");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/discharge",_r);}else{console.warn('[autowire] /api/v4/discharge skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/discharge skipped:', e.message); }
try { (function(){var _m=require("./routes/billing_v2");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/billing_v2",_r);}else{console.warn('[autowire] /api/v4/billing_v2 skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/billing_v2 skipped:', e.message); }
try { (function(){var _m=require("./routes/dicomweb");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/dicom",_r);}else{console.warn('[autowire] /api/dicom skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/dicom skipped:', e.message); }
try { (function(){var _m=require("./routes/hl7v2");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/hl7",_r);}else{console.warn('[autowire] /api/v4/hl7 skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/hl7 skipped:', e.message); }
try { (function(){var _m=require("./routes/portal");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/portal",_r);}else{console.warn('[autowire] /api/v4/portal skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/portal skipped:', e.message); }
try { (function(){var _m=require("./routes/olap");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/olap",_r);}else{console.warn('[autowire] /api/v4/olap skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/olap skipped:', e.message); }
try { (function(){var _m=require("./routes/mobile");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/mobile",_r);}else{console.warn('[autowire] /api/mobile skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/mobile skipped:', e.message); }
try { (function(){var _m=require("./routes/telehealth");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/telehealth",_r);}else{console.warn('[autowire] /api/v4/telehealth skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/telehealth skipped:', e.message); }
try { (function(){var _m=require("./routes/genomic");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/genomic",_r);}else{console.warn('[autowire] /api/v4/genomic skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/genomic skipped:', e.message); }
try { (function(){var _m=require("./routes/compounding");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/compounding",_r);}else{console.warn('[autowire] /api/v4/compounding skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/compounding skipped:', e.message); }
try { (function(){var _m=require("./routes/cqm");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/cqm",_r);}else{console.warn('[autowire] /api/v4/cqm skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/cqm skipped:', e.message); }
try { (function(){var _m=require("./routes/anesthesia");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/anesthesia",_r);}else{console.warn('[autowire] /api/v4/anesthesia skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/anesthesia skipped:', e.message); }
try { (function(){var _m=require("./routes/cardiology");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/cardiology",_r);}else{console.warn('[autowire] /api/v4/cardiology skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/cardiology skipped:', e.message); }
try { (function(){var _m=require("./routes/tumorBoard");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/mdt",_r);}else{console.warn('[autowire] /api/v4/mdt skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/mdt skipped:', e.message); }
try { (function(){var _m=require("./routes/denial");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/denial",_r);}else{console.warn('[autowire] /api/v4/denial skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/denial skipped:', e.message); }
try { (function(){var _m=require("./routes/homeHealth");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/home-health",_r);}else{console.warn('[autowire] /api/v4/home-health skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/home-health skipped:', e.message); }
try { (function(){var _m=require("./routes/trials");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/trials",_r);}else{console.warn('[autowire] /api/v4/trials skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/trials skipped:', e.message); }
try { (function(){var _m=require("./routes/populationHealth");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/population",_r);}else{console.warn('[autowire] /api/v4/population skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/population skipped:', e.message); }
try { (function(){var _m=require("./routes/pgx");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/pgx",_r);}else{console.warn('[autowire] /api/v4/pgx skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/pgx skipped:', e.message); }
try { (function(){var _m=require("./routes/voice");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/voice",_r);}else{console.warn('[autowire] /api/v4/voice skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/voice skipped:', e.message); }
try { (function(){var _m=require("./routes/aiCoPilot");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/ai",_r);}else{console.warn('[autowire] /api/v4/ai skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/ai skipped:', e.message); }
try { (function(){var _m=require("./routes/interop");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/interop",_r);}else{console.warn('[autowire] /api/v4/interop skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/interop skipped:', e.message); }
try { (function(){var _m=require("./routes/dr");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/dr",_r);}else{console.warn('[autowire] /api/v4/dr skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/dr skipped:', e.message); }
try { (function(){var _m=require("./routes/bi");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/bi",_r);}else{console.warn('[autowire] /api/v4/bi skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/bi skipped:', e.message); }
try { (function(){var _m=require("./routes/compliance");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/compliance",_r);}else{console.warn('[autowire] /api/v4/compliance skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/compliance skipped:', e.message); }
try { (function(){var _m=require("./routes/salesforce");var _r=(_m&&_m.router)||(_m&&_m.default)||_m;if(_r&&(typeof _r==='function'||_r.stack)){app.use("/api/v4/integrations/sf",_r);}else{console.warn('[autowire] /api/v4/integrations/sf skipped: no router');}})(); } catch (e) { console.warn('[autowire] /api/v4/integrations/sf skipped:', e.message); }
} catch (e) { console.warn('[mount] /api/v4/dept not mounted:', e.message); }

try { app.use('/api/v4/dept', require('./routes/dept_router')); } catch (e) { console.warn('[mount] /api/v4/dept not mounted:', e.message); }

// AUTO-MOUNT: mynama_portal (P3-E v6 owner-flagged) — patient portal sub-app
try {
  const _mynamaApp = require('./mynama/server');
  if (_mynamaApp && (_mynamaApp.handle || typeof _mynamaApp === 'function')) app.use('/mynama', _mynamaApp);
} catch (e) { console.warn('[mount] /mynama not mounted:', e.message); }
// ===== SPA CATCH-ALL (must be LAST route) =====
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


try { app.use('/api/pharm_order', require('./tier14_pharm_ext_101_order_router')); } catch(e) { console.error('pharm_order mount failed', e.message); }
try { app.use('/api/pharm_compounding', require('./tier14_pharm_ext_102_compounding_router')); } catch(e) { console.error('pharm_compounding mount failed', e.message); }
try { app.use('/api/pharm_interaction', require('./tier14_pharm_ext_103_interaction_router')); } catch(e) { console.error('pharm_interaction mount failed', e.message); }
try { app.use('/api/pharm_formulary', require('./tier14_pharm_ext_104_formulary_router')); } catch(e) { console.error('pharm_formulary mount failed', e.message); }
try { app.use('/api/pharm_inventory', require('./tier14_pharm_ext_105_inventory_router')); } catch(e) { console.error('pharm_inventory mount failed', e.message); }
try { app.use('/api/pharm_stewardship', require('./tier14_pharm_ext_106_stewardship_router')); } catch(e) { console.error('pharm_stewardship mount failed', e.message); }
try { app.use('/api/icu_vitals', require('./tier15_icu_ext_107_vitals_router')); } catch(e) { console.error('icu_vitals mount failed', e.message); }
try { app.use('/api/icu_hemodynamics', require('./tier15_icu_ext_108_hemodynamics_router')); } catch(e) { console.error('icu_hemodynamics mount failed', e.message); }
try { app.use('/api/icu_renal', require('./tier15_icu_ext_109_renal_router')); } catch(e) { console.error('icu_renal mount failed', e.message); }
try { app.use('/api/icu_nutrition', require('./tier15_icu_ext_110_nutrition_router')); } catch(e) { console.error('icu_nutrition mount failed', e.message); }
try { app.use('/api/icu_admin', require('./tier15_icu_ext_111_icu_admin_router')); } catch(e) { console.error('icu_admin mount failed', e.message); }
try { app.use('/api/or_preop', require('./tier16_or_ext_112_preop_router')); } catch(e) { console.error('or_preop mount failed', e.message); }
try { app.use('/api/or_intraop', require('./tier16_or_ext_113_intraop_router')); } catch(e) { console.error('or_intraop mount failed', e.message); }
try { app.use('/api/or_postop', require('./tier16_or_ext_114_postop_router')); } catch(e) { console.error('or_postop mount failed', e.message); }
try { app.use('/api/or_scheduling', require('./tier16_or_ext_115_scheduling_router')); } catch(e) { console.error('or_scheduling mount failed', e.message); }
try { app.use('/api/or_surgical', require('./tier16_or_ext_116_surgical_router')); } catch(e) { console.error('or_surgical mount failed', e.message); }
try { app.use('/api/portal_auth', require('./tier17_portal_ext_117_auth_router')); } catch(e) { console.error('portal_auth mount failed', e.message); }
try { app.use('/api/portal_records', require('./tier17_portal_ext_118_records_router')); } catch(e) { console.error('portal_records mount failed', e.message); }
try { app.use('/api/portal_appointments', require('./tier17_portal_ext_119_appointments_router')); } catch(e) { console.error('portal_appointments mount failed', e.message); }
try { app.use('/api/portal_billing', require('./tier17_portal_ext_120_billing_router')); } catch(e) { console.error('portal_billing mount failed', e.message); }
try { app.use('/api/portal_messaging', require('./tier17_portal_ext_121_messaging_router')); } catch(e) { console.error('portal_messaging mount failed', e.message); }
try { app.use('/api/infx_outbreak', require('./tier18_infx_ext_122_outbreak_router')); } catch(e) { console.error('infx_outbreak mount failed', e.message); }
try { app.use('/api/infx_isolation', require('./tier18_infx_ext_123_isolation_router')); } catch(e) { console.error('infx_isolation mount failed', e.message); }
try { app.use('/api/infx_mdro', require('./tier18_infx_ext_124_mdro_router')); } catch(e) { console.error('infx_mdro mount failed', e.message); }
try { app.use('/api/infx_surveillance', require('./tier18_infx_ext_125_surveillance_router')); } catch(e) { console.error('infx_surveillance mount failed', e.message); }
try { app.use('/api/infx_employee', require('./tier18_infx_ext_126_employee_router')); } catch(e) { console.error('infx_employee mount failed', e.message); }
try { app.use('/api/him_coding', require('./tier19_him_ext_127_coding_router')); } catch(e) { console.error('him_coding mount failed', e.message); }
try { app.use('/api/him_roi', require('./tier19_him_ext_128_roi_router')); } catch(e) { console.error('him_roi mount failed', e.message); }
try { app.use('/api/him_deficiency', require('./tier19_him_ext_129_deficiency_router')); } catch(e) { console.error('him_deficiency mount failed', e.message); }
try { app.use('/api/him_audit', require('./tier19_him_ext_130_audit_router')); } catch(e) { console.error('him_audit mount failed', e.message); }
try { app.use('/api/him_release', require('./tier19_him_ext_131_release_router')); } catch(e) { console.error('him_release mount failed', e.message); }
try { app.use('/api/research_trial', require('./tier20_research_ext_132_trial_router')); } catch(e) { console.error('research_trial mount failed', e.message); }
try { app.use('/api/research_consent', require('./tier20_research_ext_133_consent_router')); } catch(e) { console.error('research_consent mount failed', e.message); }
try { app.use('/api/research_irb', require('./tier20_research_ext_134_irb_router')); } catch(e) { console.error('research_irb mount failed', e.message); }
try { app.use('/api/research_recruitment', require('./tier20_research_ext_135_recruitment_router')); } catch(e) { console.error('research_recruitment mount failed', e.message); }
try { app.use('/api/research_biobank', require('./tier20_research_ext_136_biobank_router')); } catch(e) { console.error('research_biobank mount failed', e.message); }
try { app.use('/api/sched_provider', require('./tier21_sched_ext_137_provider_router')); } catch(e) { console.error('sched_provider mount failed', e.message); }
try { app.use('/api/sched_call', require('./tier21_sched_ext_138_call_router')); } catch(e) { console.error('sched_call mount failed', e.message); }
try { app.use('/api/sched_template', require('./tier21_sched_ext_139_template_router')); } catch(e) { console.error('sched_template mount failed', e.message); }
try { app.use('/api/sched_waitlist', require('./tier21_sched_ext_140_waitlist_router')); } catch(e) { console.error('sched_waitlist mount failed', e.message); }
try { app.use('/api/sched_appointment', require('./tier21_sched_ext_141_appointment_router')); } catch(e) { console.error('sched_appointment mount failed', e.message); }
try { app.use('/api/sched_staff', require('./tier21_sched_ext_142_staff_router')); } catch(e) { console.error('sched_staff mount failed', e.message); }
try { app.use('/api/wound_assessment', require('./tier22_wound_ext_143_assessment_router')); } catch(e) { console.error('wound_assessment mount failed', e.message); }
try { app.use('/api/wound_dressing', require('./tier22_wound_ext_144_dressing_router')); } catch(e) { console.error('wound_dressing mount failed', e.message); }
try { app.use('/api/wound_healing', require('./tier22_wound_ext_145_healing_router')); } catch(e) { console.error('wound_healing mount failed', e.message); }
try { app.use('/api/wound_measurement', require('./tier22_wound_ext_146_measurement_router')); } catch(e) { console.error('wound_measurement mount failed', e.message); }
try { app.use('/api/wound_staging', require('./tier22_wound_ext_147_staging_router')); } catch(e) { console.error('wound_staging mount failed', e.message); }
try { app.use('/api/dialysis_access', require('./tier23_dialysis_ext_148_access_router')); } catch(e) { console.error('dialysis_access mount failed', e.message); }
try { app.use('/api/dialysis_adequacy', require('./tier23_dialysis_ext_149_adequacy_router')); } catch(e) { console.error('dialysis_adequacy mount failed', e.message); }
try { app.use('/api/dialysis_complication', require('./tier23_dialysis_ext_150_complication_router')); } catch(e) { console.error('dialysis_complication mount failed', e.message); }
try { app.use('/api/dialysis_peritoneal', require('./tier23_dialysis_ext_151_peritoneal_router')); } catch(e) { console.error('dialysis_peritoneal mount failed', e.message); }
try { app.use('/api/dialysis_dialyzer', require('./tier23_dialysis_ext_152_dialyzer_router')); } catch(e) { console.error('dialysis_dialyzer mount failed', e.message); }
try { app.use('/api/tx_candidate', require('./tier24_transplant_ext_153_candidate_router')); } catch(e) { console.error('tx_candidate mount failed', e.message); }
try { app.use('/api/tx_donor', require('./tier24_transplant_ext_154_donor_router')); } catch(e) { console.error('tx_donor mount failed', e.message); }
try { app.use('/api/tx_immuno', require('./tier24_transplant_ext_155_immuno_router')); } catch(e) { console.error('tx_immuno mount failed', e.message); }
try { app.use('/api/tx_outcome', require('./tier24_transplant_ext_156_outcome_router')); } catch(e) { console.error('tx_outcome mount failed', e.message); }
try { app.use('/api/tx_followup', require('./tier24_transplant_ext_157_followup_router')); } catch(e) { console.error('tx_followup mount failed', e.message); }
try { app.use('/api/rehab_function', require('./tier25_rehab_ext_158_function_router')); } catch(e) { console.error('rehab_function mount failed', e.message); }
try { app.use('/api/rehab_therapy', require('./tier25_rehab_ext_159_therapy_router')); } catch(e) { console.error('rehab_therapy mount failed', e.message); }
try { app.use('/api/rehab_prosthetic', require('./tier25_rehab_ext_160_prosthetic_router')); } catch(e) { console.error('rehab_prosthetic mount failed', e.message); }
try { app.use('/api/rehab_neuro', require('./tier25_rehab_ext_161_neuro_router')); } catch(e) { console.error('rehab_neuro mount failed', e.message); }
try { app.use('/api/rehab_pediatric', require('./tier25_rehab_ext_162_pediatric_router')); } catch(e) { console.error('rehab_pediatric mount failed', e.message); }
try { app.use('/api/oncology_tumor', require('./tier26_oncology_ext_163_tumor_router')); } catch(e) { console.error('oncology_tumor mount failed', e.message); }
try { app.use('/api/oncology_chemo', require('./tier26_oncology_ext_164_chemo_router')); } catch(e) { console.error('oncology_chemo mount failed', e.message); }
try { app.use('/api/oncology_radiation', require('./tier26_oncology_ext_165_radiation_router')); } catch(e) { console.error('oncology_radiation mount failed', e.message); }
try { app.use('/api/oncology_palliative', require('./tier26_oncology_ext_166_palliative_router')); } catch(e) { console.error('oncology_palliative mount failed', e.message); }
try { app.use('/api/oncology_survivor', require('./tier26_oncology_ext_167_survivor_router')); } catch(e) { console.error('oncology_survivor mount failed', e.message); }
try { app.use('/api/ed_triage', require('./tier27_emergency_ext_168_triage_router')); } catch(e) { console.error('ed_triage mount failed', e.message); }
try { app.use('/api/ed_resus', require('./tier27_emergency_ext_169_resuscitation_router')); } catch(e) { console.error('ed_resus mount failed', e.message); }
try { app.use('/api/ed_trauma', require('./tier27_emergency_ext_170_trauma_router')); } catch(e) { console.error('ed_trauma mount failed', e.message); }
try { app.use('/api/ed_tox', require('./tier27_emergency_ext_171_toxicology_router')); } catch(e) { console.error('ed_tox mount failed', e.message); }
try { app.use('/api/ed_ems', require('./tier27_emergency_ext_172_ems_router')); } catch(e) { console.error('ed_ems mount failed', e.message); }
try { app.use('/api/ob_prenatal', require('./tier28_obstetrics_ext_173_prenatal_router')); } catch(e) { console.error('ob_prenatal mount failed', e.message); }
try { app.use('/api/ob_labor', require('./tier28_obstetrics_ext_174_labor_router')); } catch(e) { console.error('ob_labor mount failed', e.message); }
try { app.use('/api/ob_gynecology', require('./tier28_obstetrics_ext_175_gynecology_router')); } catch(e) { console.error('ob_gynecology mount failed', e.message); }
try { app.use('/api/ob_neonatal', require('./tier28_obstetrics_ext_176_neonatal_router')); } catch(e) { console.error('ob_neonatal mount failed', e.message); }
try { app.use('/api/ob_reproduction', require('./tier28_obstetrics_ext_177_reproduction_router')); } catch(e) { console.error('ob_reproduction mount failed', e.message); }
try { app.use('/api/cardio_stress', require('./tier29_cardiology_ext_178_stress_router')); } catch(e) { console.error('cardio_stress mount failed', e.message); }
try { app.use('/api/cardio_echo', require('./tier29_cardiology_ext_179_echo_router')); } catch(e) { console.error('cardio_echo mount failed', e.message); }
try { app.use('/api/cardio_cath', require('./tier29_cardiology_ext_180_cath_router')); } catch(e) { console.error('cardio_cath mount failed', e.message); }
try { app.use('/api/cardio_ep', require('./tier29_cardiology_ext_181_ep_router')); } catch(e) { console.error('cardio_ep mount failed', e.message); }
try { app.use('/api/cardio_hf', require('./tier29_cardiology_ext_182_hf_router')); } catch(e) { console.error('cardio_hf mount failed', e.message); }
try { app.use('/api/hem_transfusion', require('./tier30_hematology_ext_183_transfusion_router')); } catch(e) { console.error('hem_transfusion mount failed', e.message); }
try { app.use('/api/hem_apheresis', require('./tier30_hematology_ext_184_apheresis_router')); } catch(e) { console.error('hem_apheresis mount failed', e.message); }
try { app.use('/api/hem_stem_cell', require('./tier30_hematology_ext_185_stem_cell_router')); } catch(e) { console.error('hem_stem_cell mount failed', e.message); }
try { app.use('/api/hem_cell_therapy', require('./tier30_hematology_ext_186_cell_therapy_router')); } catch(e) { console.error('hem_cell_therapy mount failed', e.message); }
try { app.use('/api/hem_coag_ext', require('./tier30_hematology_ext_187_coag_ext_router')); } catch(e) { console.error('hem_coag_ext mount failed', e.message); }
try { app.use('/api/nephro_ckd', require('./tier31_nephrology_ext_188_ckd_router')); } catch(e) { console.error('nephro_ckd mount failed', e.message); }
try { app.use('/api/nephro_da', require('./tier31_nephrology_ext_189_dialysis_access_router')); } catch(e) { console.error('nephro_da mount failed', e.message); }
try { app.use('/api/nephro_immuno', require('./tier31_nephrology_ext_190_transplant_immuno_router')); } catch(e) { console.error('nephro_immuno mount failed', e.message); }
try { app.use('/api/nephro_ext', require('./tier31_nephrology_ext_191_nephro_ext_router')); } catch(e) { console.error('nephro_ext mount failed', e.message); }
try { app.use('/api/nephro_nutrition', require('./tier31_nephrology_ext_192_renal_nutrition_router')); } catch(e) { console.error('nephro_nutrition mount failed', e.message); }
try { app.use('/api/pulm_copd', require('./tier32_pulmonology_ext_193_copd_router')); } catch(e) { console.error('pulm_copd mount failed', e.message); }
try { app.use('/api/pulm_asthma', require('./tier32_pulmonology_ext_194_asthma_router')); } catch(e) { console.error('pulm_asthma mount failed', e.message); }
try { app.use('/api/pulm_sleep', require('./tier32_pulmonology_ext_195_sleep_router')); } catch(e) { console.error('pulm_sleep mount failed', e.message); }
try { app.use('/api/pulm_ild', require('./tier32_pulmonology_ext_196_ild_router')); } catch(e) { console.error('pulm_ild mount failed', e.message); }
try { app.use('/api/pulm_pc', require('./tier32_pulmonology_ext_197_pulm_critical_router')); } catch(e) { console.error('pulm_pc mount failed', e.message); }
try { app.use('/api/endo_diabetes', require('./tier33_endocrinology_ext_198_diabetes_router')); } catch(e) { console.error('endo_diabetes mount failed', e.message); }
try { app.use('/api/endo_thyroid', require('./tier33_endocrinology_ext_199_thyroid_router')); } catch(e) { console.error('endo_thyroid mount failed', e.message); }
try { app.use('/api/endo_adrenal', require('./tier33_endocrinology_ext_200_adrenal_router')); } catch(e) { console.error('endo_adrenal mount failed', e.message); }
try { app.use('/api/endo_pituitary', require('./tier33_endocrinology_ext_201_pituitary_router')); } catch(e) { console.error('endo_pituitary mount failed', e.message); }
try { app.use('/api/endo_metabolic', require('./tier33_endocrinology_ext_202_metabolic_router')); } catch(e) { console.error('endo_metabolic mount failed', e.message); }
try { app.use('/api/gi_ibd', require('./tier34_gastroenterology_ext_203_ibd_router')); } catch(e) { console.error('gi_ibd mount failed', e.message); }
try { app.use('/api/gi_hepa', require('./tier34_gastroenterology_ext_204_hepatology_router')); } catch(e) { console.error('gi_hepa mount failed', e.message); }
try { app.use('/api/gi_end', require('./tier34_gastroenterology_ext_205_endoscopy_router')); } catch(e) { console.error('gi_end mount failed', e.message); }
try { app.use('/api/gi_onco', require('./tier34_gastroenterology_ext_206_gi_oncology_router')); } catch(e) { console.error('gi_onco mount failed', e.message); }
try { app.use('/api/gi_nut', require('./tier34_gastroenterology_ext_207_gi_nutrition_router')); } catch(e) { console.error('gi_nut mount failed', e.message); }
try { app.use('/api/rheum_ra', require('./tier35_rheumatology_ext_208_ra_router')); } catch(e) { console.error('rheum_ra mount failed', e.message); }
try { app.use('/api/rheum_lupus', require('./tier35_rheumatology_ext_209_lupus_router')); } catch(e) { console.error('rheum_lupus mount failed', e.message); }
try { app.use('/api/rheum_vasculitis', require('./tier35_rheumatology_ext_210_vasculitis_router')); } catch(e) { console.error('rheum_vasculitis mount failed', e.message); }
try { app.use('/api/rheum_myo', require('./tier35_rheumatology_ext_211_myositis_router')); } catch(e) { console.error('rheum_myo mount failed', e.message); }
try { app.use('/api/rheum_spine', require('./tier35_rheumatology_ext_212_spine_router')); } catch(e) { console.error('rheum_spine mount failed', e.message); }
try { app.use('/api/infx_hiv', require('./tier36_infectious_disease_ext_213_hiv_router')); } catch(e) { console.error('infx_hiv mount failed', e.message); }
try { app.use('/api/infx_tb', require('./tier36_infectious_disease_ext_214_tb_router')); } catch(e) { console.error('infx_tb mount failed', e.message); }
try { app.use('/api/infx_hepa', require('./tier36_infectious_disease_ext_215_hepatitis_router')); } catch(e) { console.error('infx_hepa mount failed', e.message); }
try { app.use('/api/infx_trop', require('./tier36_infectious_disease_ext_216_tropical_router')); } catch(e) { console.error('infx_trop mount failed', e.message); }
try { app.use('/api/infx_stew', require('./tier36_infectious_disease_ext_217_stewardship_router')); } catch(e) { console.error('infx_stew mount failed', e.message); }
try { app.use('/api/neuro_stroke', require('./tier37_neurology_ext_218_stroke_router')); } catch(e) { console.error('neuro_stroke mount failed', e.message); }
try { app.use('/api/neuro_epi', require('./tier37_neurology_ext_219_epilepsy_router')); } catch(e) { console.error('neuro_epi mount failed', e.message); }
try { app.use('/api/neuro_ms', require('./tier37_neurology_ext_220_ms_router')); } catch(e) { console.error('neuro_ms mount failed', e.message); }
try { app.use('/api/neuro_mov', require('./tier37_neurology_ext_221_movement_router')); } catch(e) { console.error('neuro_mov mount failed', e.message); }
try { app.use('/api/neuro_nm', require('./tier37_neurology_ext_222_neuro_musc_router')); } catch(e) { console.error('neuro_nm mount failed', e.message); }
try { app.use('/api/derm_psor', require('./tier38_dermatology_ext_223_psoriasis_router')); } catch(e) { console.error('derm_psor mount failed', e.message); }
try { app.use('/api/derm_ecz', require('./tier38_dermatology_ext_224_eczema_router')); } catch(e) { console.error('derm_ecz mount failed', e.message); }
try { app.use('/api/derm_skin', require('./tier38_dermatology_ext_225_skin_cancer_router')); } catch(e) { console.error('derm_skin mount failed', e.message); }
try { app.use('/api/derm_acne', require('./tier38_dermatology_ext_226_acne_router')); } catch(e) { console.error('derm_acne mount failed', e.message); }
try { app.use('/api/derm_hair', require('./tier38_dermatology_ext_227_hair_nails_router')); } catch(e) { console.error('derm_hair mount failed', e.message); }
try { app.use('/api/ent_oto', require('./tier39_ent_ext_228_otology_router')); } catch(e) { console.error('ent_oto mount failed', e.message); }
try { app.use('/api/ent_rhino', require('./tier39_ent_ext_229_rhinology_router')); } catch(e) { console.error('ent_rhino mount failed', e.message); }
try { app.use('/api/ent_laryn', require('./tier39_ent_ext_230_laryngology_router')); } catch(e) { console.error('ent_laryn mount failed', e.message); }
try { app.use('/api/ent_hn', require('./tier39_ent_ext_231_head_neck_router')); } catch(e) { console.error('ent_hn mount failed', e.message); }
try { app.use('/api/ent_ped', require('./tier39_ent_ext_232_ped_ent_router')); } catch(e) { console.error('ent_ped mount failed', e.message); }
try { app.use('/api/ophth_glaucoma', require('./tier40_ophthalmology_ext_233_glaucoma_router')); } catch(e) { console.error('ophth_glaucoma mount failed', e.message); }
try { app.use('/api/ophth_retina', require('./tier40_ophthalmology_ext_234_retina_router')); } catch(e) { console.error('ophth_retina mount failed', e.message); }
try { app.use('/api/ophth_cornea', require('./tier40_ophthalmology_ext_235_cornea_router')); } catch(e) { console.error('ophth_cornea mount failed', e.message); }
try { app.use('/api/ophth_plas', require('./tier40_ophthalmology_ext_236_oculoplast_router')); } catch(e) { console.error('ophth_plas mount failed', e.message); }
try { app.use('/api/ophth_no', require('./tier40_ophthalmology_ext_237_neuro_ophth_router')); } catch(e) { console.error('ophth_no mount failed', e.message); }
try { app.use('/api/ob_high_risk', require('./tier41_obstetrics_ext_238_high_risk_router')); } catch(e) { console.error('ob_high_risk mount failed', e.message); }
try { app.use('/api/ob_fetal', require('./tier41_obstetrics_ext_239_fetal_mon_router')); } catch(e) { console.error('ob_fetal mount failed', e.message); }
try { app.use('/api/ob_procedures', require('./tier41_obstetrics_ext_240_ob_procedures_router')); } catch(e) { console.error('ob_procedures mount failed', e.message); }
try { app.use('/api/ob_postpartum', require('./tier41_obstetrics_ext_241_postpartum_router')); } catch(e) { console.error('ob_postpartum mount failed', e.message); }
try { app.use('/api/ob_lactation', require('./tier41_obstetrics_ext_242_lactation_router')); } catch(e) { console.error('ob_lactation mount failed', e.message); }
try { app.use('/api/psych_mood', require('./tier42_psychiatry_ext_243_mood_anx_router')); } catch(e) { console.error('psych_mood mount failed', e.message); }
try { app.use('/api/psych_psychotic', require('./tier42_psychiatry_ext_244_psychotic_router')); } catch(e) { console.error('psych_psychotic mount failed', e.message); }
try { app.use('/api/psych_trauma', require('./tier42_psychiatry_ext_245_trauma_router')); } catch(e) { console.error('psych_trauma mount failed', e.message); }
try { app.use('/api/psych_substance', require('./tier42_psychiatry_ext_246_substance_router')); } catch(e) { console.error('psych_substance mount failed', e.message); }
try { app.use('/api/psych_neurodev', require('./tier42_psychiatry_ext_247_neurodev_router')); } catch(e) { console.error('psych_neurodev mount failed', e.message); }
try { app.use('/api/surg_gi', require('./tier43_surgery_ext_248_gi_surg_router')); } catch(e) { console.error('surg_gi mount failed', e.message); }
try { app.use('/api/surg_ortho', require('./tier43_surgery_ext_249_ortho_surg_router')); } catch(e) { console.error('surg_ortho mount failed', e.message); }
try { app.use('/api/surg_vasc', require('./tier43_surgery_ext_250_vascular_router')); } catch(e) { console.error('surg_vasc mount failed', e.message); }
try { app.use('/api/surg_trauma', require('./tier43_surgery_ext_251_trauma_router')); } catch(e) { console.error('surg_trauma mount failed', e.message); }
try { app.use('/api/surg_transplant', require('./tier43_surgery_ext_252_transplant_router')); } catch(e) { console.error('surg_transplant mount failed', e.message); }
try { app.use('/api/ped_resp', require('./tier44_pediatrics_ext_253_ped_resp_router')); } catch(e) { console.error('ped_resp mount failed', e.message); }
try { app.use('/api/ped_neonat', require('./tier44_pediatrics_ext_254_ped_neonat_router')); } catch(e) { console.error('ped_neonat mount failed', e.message); }
try { app.use('/api/ped_gastro', require('./tier44_pediatrics_ext_255_ped_gastro_router')); } catch(e) { console.error('ped_gastro mount failed', e.message); }
try { app.use('/api/ped_endo', require('./tier44_pediatrics_ext_256_ped_endo_router')); } catch(e) { console.error('ped_endo mount failed', e.message); }
try { app.use('/api/ped_immuno', require('./tier44_pediatrics_ext_257_ped_immuno_router')); } catch(e) { console.error('ped_immuno mount failed', e.message); }
try { app.use('/api/icu_vent', require('./tier45_icu_ext_258_icu_vent_router')); } catch(e) { console.error('icu_vent mount failed', e.message); }
try { app.use('/api/icu_sepsis', require('./tier45_icu_ext_259_icu_sepsis_router')); } catch(e) { console.error('icu_sepsis mount failed', e.message); }
try { app.use('/api/icu_hemodyn', require('./tier45_icu_ext_260_icu_hemodyn_router')); } catch(e) { console.error('icu_hemodyn mount failed', e.message); }
try { app.use('/api/icu_neuro', require('./tier45_icu_ext_261_icu_neuro_router')); } catch(e) { console.error('icu_neuro mount failed', e.message); }
try { app.use('/api/icu_renal', require('./tier45_icu_ext_262_icu_renal_router')); } catch(e) { console.error('icu_renal mount failed', e.message); }
try { app.use('/api/pharm_onco', require('./tier46_pharmacy_ext_263_pharm_onco_router')); } catch(e) { console.error('pharm_onco mount failed', e.message); }
try { app.use('/api/pharm_antinf', require('./tier46_pharmacy_ext_264_pharm_antinf_router')); } catch(e) { console.error('pharm_antinf mount failed', e.message); }
try { app.use('/api/pharm_chronic', require('./tier46_pharmacy_ext_265_pharm_chronic_router')); } catch(e) { console.error('pharm_chronic mount failed', e.message); }
try { app.use('/api/pharm_pain', require('./tier46_pharmacy_ext_266_pharm_pain_router')); } catch(e) { console.error('pharm_pain mount failed', e.message); }
try { app.use('/api/pharm_special', require('./tier46_pharmacy_ext_267_pharm_special_router')); } catch(e) { console.error('pharm_special mount failed', e.message); }
try { app.use('/api/rad_body', require('./tier47_radiology_ext_268_rad_body_router')); } catch(e) { console.error('rad_body mount failed', e.message); }
try { app.use('/api/rad_neuro', require('./tier47_radiology_ext_269_rad_neuro_router')); } catch(e) { console.error('rad_neuro mount failed', e.message); }
try { app.use('/api/rad_cardio', require('./tier47_radiology_ext_270_rad_cardio_router')); } catch(e) { console.error('rad_cardio mount failed', e.message); }
try { app.use('/api/rad_gu_gi', require('./tier47_radiology_ext_271_rad_gu_gi_router')); } catch(e) { console.error('rad_gu_gi mount failed', e.message); }
try { app.use('/api/rad_interv', require('./tier47_radiology_ext_272_rad_interv_router')); } catch(e) { console.error('rad_interv mount failed', e.message); }
try { app.use('/api/lab_heme', require('./tier48_laboratory_ext_273_lab_heme_router')); } catch(e) { console.error('lab_heme mount failed', e.message); }
try { app.use('/api/lab_chem', require('./tier48_laboratory_ext_274_lab_chem_router')); } catch(e) { console.error('lab_chem mount failed', e.message); }
try { app.use('/api/lab_micro', require('./tier48_laboratory_ext_275_lab_micro_router')); } catch(e) { console.error('lab_micro mount failed', e.message); }
try { app.use('/api/lab_immuno', require('./tier48_laboratory_ext_276_lab_immuno_router')); } catch(e) { console.error('lab_immuno mount failed', e.message); }
try { app.use('/api/lab_mol', require('./tier48_laboratory_ext_277_lab_mol_router')); } catch(e) { console.error('lab_mol mount failed', e.message); }
try { app.use('/api/nurs_assess', require('./tier49_nursing_ext_278_nurs_assess_router')); } catch(e) { console.error('nurs_assess mount failed', e.message); }
try { app.use('/api/nurs_med', require('./tier49_nursing_ext_279_nurs_med_router')); } catch(e) { console.error('nurs_med mount failed', e.message); }
try { app.use('/api/nurs_wound', require('./tier49_nursing_ext_280_nurs_wound_router')); } catch(e) { console.error('nurs_wound mount failed', e.message); }
try { app.use('/api/nurs_resp', require('./tier49_nursing_ext_281_nurs_resp_router')); } catch(e) { console.error('nurs_resp mount failed', e.message); }
try { app.use('/api/nurs_safety', require('./tier49_nursing_ext_282_nurs_safety_router')); } catch(e) { console.error('nurs_safety mount failed', e.message); }
try { app.use('/api/card_failure', require('./tier50_cardiology_ext_283_card_failure_router')); } catch(e) { console.error('card_failure mount failed', e.message); }
try { app.use('/api/card_arr', require('./tier50_cardiology_ext_284_card_arr_router')); } catch(e) { console.error('card_arr mount failed', e.message); }
try { app.use('/api/card_valve', require('./tier50_cardiology_ext_285_card_valve_router')); } catch(e) { console.error('card_valve mount failed', e.message); }
try { app.use('/api/card_ischemic', require('./tier50_cardiology_ext_286_card_ischemic_router')); } catch(e) { console.error('card_ischemic mount failed', e.message); }
try { app.use('/api/card_cong', require('./tier50_cardiology_ext_287_card_cong_router')); } catch(e) { console.error('card_cong mount failed', e.message); }
try { app.use('/api/derm_infla', require('./tier51_dermatology_ext_288_derm_infla_router')); } catch(e) { console.error('derm_infla mount failed', e.message); }
try { app.use('/api/derm_inf', require('./tier51_dermatology_ext_289_derm_inf_router')); } catch(e) { console.error('derm_inf mount failed', e.message); }
try { app.use('/api/derm_neo', require('./tier51_dermatology_ext_290_derm_neo_router')); } catch(e) { console.error('derm_neo mount failed', e.message); }
try { app.use('/api/derm_pig', require('./tier51_dermatology_ext_291_derm_pig_router')); } catch(e) { console.error('derm_pig mount failed', e.message); }
try { app.use('/api/derm_proced', require('./tier51_dermatology_ext_292_derm_proced_router')); } catch(e) { console.error('derm_proced mount failed', e.message); }
try { app.use('/api/rehab_pt', require('./tier52_rehabilitation_ext_293_rehab_pt_router')); } catch(e) { console.error('rehab_pt mount failed', e.message); }
try { app.use('/api/rehab_ot', require('./tier52_rehabilitation_ext_294_rehab_ot_router')); } catch(e) { console.error('rehab_ot mount failed', e.message); }
try { app.use('/api/rehab_slp', require('./tier52_rehabilitation_ext_295_rehab_slp_router')); } catch(e) { console.error('rehab_slp mount failed', e.message); }
try { app.use('/api/rehab_prosth', require('./tier52_rehabilitation_ext_296_rehab_prosth_router')); } catch(e) { console.error('rehab_prosth mount failed', e.message); }
try { app.use('/api/rehab_pain', require('./tier52_rehabilitation_ext_297_rehab_pain_router')); } catch(e) { console.error('rehab_pain mount failed', e.message); }
try { app.use('/api/onc_breast', require('./tier53_oncology_ext_298_onc_breast_router')); } catch(e) { console.error('onc_breast mount failed', e.message); }
try { app.use('/api/onc_lung', require('./tier53_oncology_ext_299_onc_lung_router')); } catch(e) { console.error('onc_lung mount failed', e.message); }
try { app.use('/api/onc_gi', require('./tier53_oncology_ext_300_onc_gi_router')); } catch(e) { console.error('onc_gi mount failed', e.message); }
try { app.use('/api/onc_gu', require('./tier53_oncology_ext_301_onc_gu_router')); } catch(e) { console.error('onc_gu mount failed', e.message); }
try { app.use('/api/onc_heme', require('./tier53_oncology_ext_302_onc_heme_router')); } catch(e) { console.error('onc_heme mount failed', e.message); }
try { app.use('/api/er_trauma', require('./tier54_emergency_ext_303_er_trauma_router')); } catch(e) { console.error('er_trauma mount failed', e.message); }
try { app.use('/api/er_cardio', require('./tier54_emergency_ext_304_er_cardio_router')); } catch(e) { console.error('er_cardio mount failed', e.message); }
try { app.use('/api/er_neuro', require('./tier54_emergency_ext_305_er_neuro_router')); } catch(e) { console.error('er_neuro mount failed', e.message); }
try { app.use('/api/er_resp', require('./tier54_emergency_ext_306_er_resp_router')); } catch(e) { console.error('er_resp mount failed', e.message); }
try { app.use('/api/er_gi_gi', require('./tier54_emergency_ext_307_er_gi_gi_router')); } catch(e) { console.error('er_gi_gi mount failed', e.message); }
try { app.use('/api/triage_acu', require('./tier55_triage_ext_308_triage_acu_router')); } catch(e) { console.error('triage_acu mount failed', e.message); }
try { app.use('/api/triage_intake', require('./tier55_triage_ext_309_triage_intake_router')); } catch(e) { console.error('triage_intake mount failed', e.message); }
try { app.use('/api/triage_screen', require('./tier55_triage_ext_310_triage_screen_router')); } catch(e) { console.error('triage_screen mount failed', e.message); }
try { app.use('/api/triage_ped', require('./tier55_triage_ext_311_triage_ped_router')); } catch(e) { console.error('triage_ped mount failed', e.message); }
try { app.use('/api/triage_disp', require('./tier55_triage_ext_312_triage_disp_router')); } catch(e) { console.error('triage_disp mount failed', e.message); }
try { app.use('/api/surg_neuro', require('./tier56_surgical_specialties_313_surg_neuro_router')); } catch(e) { console.error('surg_neuro mount failed', e.message); }
try { app.use('/api/surg_plastic', require('./tier56_surgical_specialties_314_surg_plastic_router')); } catch(e) { console.error('surg_plastic mount failed', e.message); }
try { app.use('/api/surg_urology', require('./tier56_surgical_specialties_315_surg_urology_router')); } catch(e) { console.error('surg_urology mount failed', e.message); }
try { app.use('/api/surg_ent_surg', require('./tier56_surgical_specialties_316_surg_ent_surg_router')); } catch(e) { console.error('surg_ent_surg mount failed', e.message); }
try { app.use('/api/surg_thoracic', require('./tier56_surgical_specialties_317_surg_thoracic_router')); } catch(e) { console.error('surg_thoracic mount failed', e.message); }
try { app.use('/api/img_advanced', require('./tier57_imaging_ext_318_img_advanced_router')); } catch(e) { console.error('img_advanced mount failed', e.message); }
try { app.use('/api/img_us_ext', require('./tier57_imaging_ext_319_img_us_ext_router')); } catch(e) { console.error('img_us_ext mount failed', e.message); }
try { app.use('/api/img_breast', require('./tier57_imaging_ext_320_img_breast_router')); } catch(e) { console.error('img_breast mount failed', e.message); }
try { app.use('/api/img_msk', require('./tier57_imaging_ext_321_img_msk_router')); } catch(e) { console.error('img_msk mount failed', e.message); }
try { app.use('/api/img_emergent', require('./tier57_imaging_ext_322_img_emergent_router')); } catch(e) { console.error('img_emergent mount failed', e.message); }
try { app.use('/api/res_trial', require('./tier58_research_ext_323_res_trial_router')); } catch(e) { console.error('res_trial mount failed', e.message); }
try { app.use('/api/res_pub', require('./tier58_research_ext_324_res_pub_router')); } catch(e) { console.error('res_pub mount failed', e.message); }
try { app.use('/api/res_grant', require('./tier58_research_ext_325_res_grant_router')); } catch(e) { console.error('res_grant mount failed', e.message); }
try { app.use('/api/res_data', require('./tier58_research_ext_326_res_data_router')); } catch(e) { console.error('res_data mount failed', e.message); }
try { app.use('/api/res_ethics', require('./tier58_research_ext_327_res_ethics_router')); } catch(e) { console.error('res_ethics mount failed', e.message); }
try { app.use('/api/tele_visit', require('./tier59_telemedicine_328_tele_visit_router')); } catch(e) { console.error('tele_visit mount failed', e.message); }
try { app.use('/api/tele_monitor', require('./tier59_telemedicine_329_tele_monitor_router')); } catch(e) { console.error('tele_monitor mount failed', e.message); }
try { app.use('/api/tele_surg', require('./tier59_telemedicine_330_tele_surg_router')); } catch(e) { console.error('tele_surg mount failed', e.message); }
try { app.use('/api/tele_psy', require('./tier59_telemedicine_331_tele_psy_router')); } catch(e) { console.error('tele_psy mount failed', e.message); }
try { app.use('/api/tele_admin', require('./tier59_telemedicine_332_tele_admin_router')); } catch(e) { console.error('tele_admin mount failed', e.message); }
try { app.use('/api/ai_clin_dec', require('./tier60_ai_brain_ext_333_ai_clin_dec_router')); } catch(e) { console.error('ai_clin_dec mount failed', e.message); }
try { app.use('/api/ai_diag_img', require('./tier60_ai_brain_ext_334_ai_diag_img_router')); } catch(e) { console.error('ai_diag_img mount failed', e.message); }
try { app.use('/api/ai_nlp_doc', require('./tier60_ai_brain_ext_335_ai_nlp_doc_router')); } catch(e) { console.error('ai_nlp_doc mount failed', e.message); }
try { app.use('/api/ai_forecast', require('./tier60_ai_brain_ext_336_ai_forecast_router')); } catch(e) { console.error('ai_forecast mount failed', e.message); }
try { app.use('/api/ai_chatbot', require('./tier60_ai_brain_ext_337_ai_chatbot_router')); } catch(e) { console.error('ai_chatbot mount failed', e.message); }
try { app.use('/api/ops_facility', require('./tier61_ops_ext_338_ops_facility_router')); } catch(e) { console.error('ops_facility mount failed', e.message); }
try { app.use('/api/ops_assets', require('./tier61_ops_ext_339_ops_assets_router')); } catch(e) { console.error('ops_assets mount failed', e.message); }
try { app.use('/api/ops_vendor', require('./tier61_ops_ext_340_ops_vendor_router')); } catch(e) { console.error('ops_vendor mount failed', e.message); }
try { app.use('/api/ops_legal', require('./tier61_ops_ext_341_ops_legal_router')); } catch(e) { console.error('ops_legal mount failed', e.message); }
try { app.use('/api/ops_quality', require('./tier61_ops_ext_342_ops_quality_router')); } catch(e) { console.error('ops_quality mount failed', e.message); }
try { app.use('/api/sp_geri', require('./tier62_spec_care_ext_343_sp_geri_router')); } catch(e) { console.error('sp_geri mount failed', e.message); }
try { app.use('/api/sp_pall', require('./tier62_spec_care_ext_344_sp_pall_router')); } catch(e) { console.error('sp_pall mount failed', e.message); }
try { app.use('/api/sp_home', require('./tier62_spec_care_ext_345_sp_home_router')); } catch(e) { console.error('sp_home mount failed', e.message); }
try { app.use('/api/sp_rehab', require('./tier62_spec_care_ext_346_sp_rehab_router')); } catch(e) { console.error('sp_rehab mount failed', e.message); }
try { app.use('/api/sp_mat', require('./tier62_spec_care_ext_347_sp_mat_router')); } catch(e) { console.error('sp_mat mount failed', e.message); }
try { app.use('/api/px_satis', require('./tier63_px_348_px_satis_router')); } catch(e) { console.error('px_satis mount failed', e.message); }
try { app.use('/api/px_engage', require('./tier63_px_349_px_engage_router')); } catch(e) { console.error('px_engage mount failed', e.message); }
try { app.use('/api/px_access', require('./tier63_px_350_px_access_router')); } catch(e) { console.error('px_access mount failed', e.message); }
try { app.use('/api/px_feedback', require('./tier63_px_351_px_feedback_router')); } catch(e) { console.error('px_feedback mount failed', e.message); }
try { app.use('/api/px_journey', require('./tier63_px_352_px_journey_router')); } catch(e) { console.error('px_journey mount failed', e.message); }
try { app.use('/api/pop_registries', require('./tier64_pop_health_348_pop_registries_router')); } catch(e) { console.error('pop_registries mount failed', e.message); }
try { app.use('/api/pop_screen', require('./tier64_pop_health_349_pop_screen_router')); } catch(e) { console.error('pop_screen mount failed', e.message); }
try { app.use('/api/pop_cohort', require('./tier64_pop_health_350_pop_cohort_router')); } catch(e) { console.error('pop_cohort mount failed', e.message); }
try { app.use('/api/pop_outreach', require('./tier64_pop_health_351_pop_outreach_router')); } catch(e) { console.error('pop_outreach mount failed', e.message); }
try { app.use('/api/pop_metrics', require('./tier64_pop_health_352_pop_metrics_router')); } catch(e) { console.error('pop_metrics mount failed', e.message); }
try { app.use('/api/rev_charge', require('./tier65_rev_cycle_353_rev_charge_router')); } catch(e) { console.error('rev_charge mount failed', e.message); }
try { app.use('/api/rev_claim', require('./tier65_rev_cycle_354_rev_claim_router')); } catch(e) { console.error('rev_claim mount failed', e.message); }
try { app.use('/api/rev_payment', require('./tier65_rev_cycle_355_rev_payment_router')); } catch(e) { console.error('rev_payment mount failed', e.message); }
try { app.use('/api/rev_audit', require('./tier65_rev_cycle_356_rev_audit_router')); } catch(e) { console.error('rev_audit mount failed', e.message); }
try { app.use('/api/rev_contract', require('./tier65_rev_cycle_357_rev_contract_router')); } catch(e) { console.error('rev_contract mount failed', e.message); }
try { app.use('/api/lab_specimen', require('./tier66_lab_diag_358_lab_specimen_router')); } catch(e) { console.error('lab_specimen mount failed', e.message); }
try { app.use('/api/lab_result', require('./tier66_lab_diag_359_lab_result_router')); } catch(e) { console.error('lab_result mount failed', e.message); }
try { app.use('/api/lab_micro', require('./tier66_lab_diag_360_lab_micro_router')); } catch(e) { console.error('lab_micro mount failed', e.message); }
try { app.use('/api/lab_path', require('./tier66_lab_diag_361_lab_path_router')); } catch(e) { console.error('lab_path mount failed', e.message); }
try { app.use('/api/lab_qc', require('./tier66_lab_diag_362_lab_qc_router')); } catch(e) { console.error('lab_qc mount failed', e.message); }
try { app.use('/api/surg_pre_admit', require('./tier67_surg_periop_363_surg_pre_admit_router')); } catch(e) { console.error('surg_pre_admit mount failed', e.message); }
try { app.use('/api/surg_intraop', require('./tier67_surg_periop_364_surg_intraop_router')); } catch(e) { console.error('surg_intraop mount failed', e.message); }
try { app.use('/api/surg_postop', require('./tier67_surg_periop_365_surg_postop_router')); } catch(e) { console.error('surg_postop mount failed', e.message); }
try { app.use('/api/surg_complications', require('./tier67_surg_periop_366_surg_complications_router')); } catch(e) { console.error('surg_complications mount failed', e.message); }
try { app.use('/api/surg_quality', require('./tier67_surg_periop_367_surg_quality_router')); } catch(e) { console.error('surg_quality mount failed', e.message); }
try { app.use('/api/rx_clinical', require('./tier68_rx_368_rx_clinical_router')); } catch(e) { console.error('rx_clinical mount failed', e.message); }
try { app.use('/api/rx_oncology', require('./tier68_rx_369_rx_oncology_router')); } catch(e) { console.error('rx_oncology mount failed', e.message); }
try { app.use('/api/rx_specialty', require('./tier68_rx_370_rx_specialty_router')); } catch(e) { console.error('rx_specialty mount failed', e.message); }
try { app.use('/api/rx_clinical_pharm', require('./tier68_rx_371_rx_clinical_pharm_router')); } catch(e) { console.error('rx_clinical_pharm mount failed', e.message); }
try { app.use('/api/rx_informatics', require('./tier68_rx_372_rx_informatics_router')); } catch(e) { console.error('rx_informatics mount failed', e.message); }
try { app.use('/api/mh_assess', require('./tier69_mh_373_mh_assess_router')); } catch(e) { console.error('mh_assess mount failed', e.message); }
try { app.use('/api/mh_therapy', require('./tier69_mh_374_mh_therapy_router')); } catch(e) { console.error('mh_therapy mount failed', e.message); }
try { app.use('/api/mh_psychopharm', require('./tier69_mh_375_mh_psychopharm_router')); } catch(e) { console.error('mh_psychopharm mount failed', e.message); }
try { app.use('/api/mh_addiction', require('./tier69_mh_376_mh_addiction_router')); } catch(e) { console.error('mh_addiction mount failed', e.message); }
try { app.use('/api/mh_community', require('./tier69_mh_377_mh_community_router')); } catch(e) { console.error('mh_community mount failed', e.message); }
try { app.use('/api/img_proc', require('./tier70_img_diag_378_img_proc_router')); } catch(e) { console.error('img_proc mount failed', e.message); }
try { app.use('/api/img_interp', require('./tier70_img_diag_379_img_interp_router')); } catch(e) { console.error('img_interp mount failed', e.message); }
try { app.use('/api/img_admin', require('./tier70_img_diag_380_img_admin_router')); } catch(e) { console.error('img_admin mount failed', e.message); }
try { app.use('/api/img_specialty', require('./tier70_img_diag_381_img_specialty_router')); } catch(e) { console.error('img_specialty mount failed', e.message); }
try { app.use('/api/img_safety', require('./tier70_img_diag_382_img_safety_router')); } catch(e) { console.error('img_safety mount failed', e.message); }
try { app.use('/api/nut_assess', require('./tier71_nut_383_nut_assess_router')); } catch(e) { console.error('nut_assess mount failed', e.message); }
try { app.use('/api/nut_intervention', require('./tier71_nut_384_nut_intervention_router')); } catch(e) { console.error('nut_intervention mount failed', e.message); }
try { app.use('/api/nut_clinical', require('./tier71_nut_385_nut_clinical_router')); } catch(e) { console.error('nut_clinical mount failed', e.message); }
try { app.use('/api/nut_pediatric', require('./tier71_nut_386_nut_pediatric_router')); } catch(e) { console.error('nut_pediatric mount failed', e.message); }
try { app.use('/api/nut_admin', require('./tier71_nut_387_nut_admin_router')); } catch(e) { console.error('nut_admin mount failed', e.message); }
try { app.use('/api/er_triage', require('./tier72_er_388_er_triage_router')); } catch(e) { console.error('er_triage mount failed', e.message); }
try { app.use('/api/er_resus', require('./tier72_er_389_er_resus_router')); } catch(e) { console.error('er_resus mount failed', e.message); }
try { app.use('/api/er_medic', require('./tier72_er_390_er_medic_router')); } catch(e) { console.error('er_medic mount failed', e.message); }
try { app.use('/api/er_trauma', require('./tier72_er_391_er_trauma_router')); } catch(e) { console.error('er_trauma mount failed', e.message); }
try { app.use('/api/er_dispos', require('./tier72_er_392_er_dispos_router')); } catch(e) { console.error('er_dispos mount failed', e.message); }
try { app.use('/api/cardio_ext_ep', require('./tier73_cardio_ext_383_cardio_ep_router')); } catch(e) { console.error('cardio_ext_ep mount failed', e.message); }
try { app.use('/api/cardio_ext_imaging', require('./tier73_cardio_ext_384_cardio_imaging_router')); } catch(e) { console.error('cardio_ext_imaging mount failed', e.message); }
try { app.use('/api/cardio_ext_chf', require('./tier73_cardio_ext_385_cardio_chf_router')); } catch(e) { console.error('cardio_ext_chf mount failed', e.message); }
try { app.use('/api/cardio_ext_rehab', require('./tier73_cardio_ext_386_cardio_rehab_router')); } catch(e) { console.error('cardio_ext_rehab mount failed', e.message); }
try { app.use('/api/cardio_ext_prevention', require('./tier73_cardio_ext_387_cardio_prevention_router')); } catch(e) { console.error('cardio_ext_prevention mount failed', e.message); }
try { app.use('/api/onc_ext_treat', require('./tier74_onc_ext_393_onc_ext_treat_router')); } catch(e) { console.error('onc_ext_treat mount failed', e.message); }
try { app.use('/api/onc_ext_followup', require('./tier74_onc_ext_394_onc_ext_followup_router')); } catch(e) { console.error('onc_ext_followup mount failed', e.message); }
try { app.use('/api/onc_ext_special', require('./tier74_onc_ext_395_onc_ext_special_router')); } catch(e) { console.error('onc_ext_special mount failed', e.message); }
try { app.use('/api/onc_ext_symptom', require('./tier74_onc_ext_396_onc_ext_symptom_router')); } catch(e) { console.error('onc_ext_symptom mount failed', e.message); }
try { app.use('/api/onc_ext_support', require('./tier74_onc_ext_397_onc_ext_support_router')); } catch(e) { console.error('onc_ext_support mount failed', e.message); }
try { app.use('/api/pulm_assess', require('./tier75_pulm_ext_398_pulm_assess_router')); } catch(e) { console.error('pulm_assess mount failed', e.message); }
try { app.use('/api/pulm_disease', require('./tier75_pulm_ext_399_pulm_disease_router')); } catch(e) { console.error('pulm_disease mount failed', e.message); }
try { app.use('/api/pulm_proc', require('./tier75_pulm_ext_400_pulm_proc_router')); } catch(e) { console.error('pulm_proc mount failed', e.message); }
try { app.use('/api/pulm_special', require('./tier75_pulm_ext_401_pulm_special_router')); } catch(e) { console.error('pulm_special mount failed', e.message); }
try { app.use('/api/pulm_icu', require('./tier75_pulm_ext_402_pulm_icu_router')); } catch(e) { console.error('pulm_icu mount failed', e.message); }
try { app.use('/api/endo_diabetes_v2', require('./tier76_endo_ext_403_endo_diabetes_router')); } catch(e) { console.error('endo_diabetes_v2 mount failed', e.message); }
try { app.use('/api/endo_thyroid_v2', require('./tier76_endo_ext_404_endo_thyroid_router')); } catch(e) { console.error('endo_thyroid_v2 mount failed', e.message); }
try { app.use('/api/endo_adrenal_v2', require('./tier76_endo_ext_405_endo_adrenal_router')); } catch(e) { console.error('endo_adrenal_v2 mount failed', e.message); }
try { app.use('/api/endo_pituitary_v2', require('./tier76_endo_ext_406_endo_pituitary_router')); } catch(e) { console.error('endo_pituitary_v2 mount failed', e.message); }
try { app.use('/api/endo_special_v2', require('./tier76_endo_ext_407_endo_special_router')); } catch(e) { console.error('endo_special_v2 mount failed', e.message); }
try { app.use('/api/neuro_stroke_v2', require('./tier77_neuro_ext_408_neuro_stroke_router')); } catch(e) { console.error('neuro_stroke_v2 mount failed', e.message); }
try { app.use('/api/neuro_epilepsy_v2', require('./tier77_neuro_ext_409_neuro_epilepsy_router')); } catch(e) { console.error('neuro_epilepsy_v2 mount failed', e.message); }
try { app.use('/api/neuro_movement_v2', require('./tier77_neuro_ext_410_neuro_movement_router')); } catch(e) { console.error('neuro_movement_v2 mount failed', e.message); }
try { app.use('/api/neuro_neuromuscular_v2', require('./tier77_neuro_ext_411_neuro_neuromuscular_router')); } catch(e) { console.error('neuro_neuromuscular_v2 mount failed', e.message); }
try { app.use('/api/neuro_headache_v2', require('./tier77_neuro_ext_412_neuro_headache_router')); } catch(e) { console.error('neuro_headache_v2 mount failed', e.message); }
try { app.use('/api/ortho_trauma_v2', require('./tier78_ortho_ext_413_ortho_trauma_router')); } catch(e) { console.error('ortho_trauma_v2 mount failed', e.message); }
try { app.use('/api/ortho_joint_v2', require('./tier78_ortho_ext_414_ortho_joint_router')); } catch(e) { console.error('ortho_joint_v2 mount failed', e.message); }
try { app.use('/api/ortho_spine_v2', require('./tier78_ortho_ext_415_ortho_spine_router')); } catch(e) { console.error('ortho_spine_v2 mount failed', e.message); }
try { app.use('/api/ortho_sports_v2', require('./tier78_ortho_ext_416_ortho_sports_router')); } catch(e) { console.error('ortho_sports_v2 mount failed', e.message); }
try { app.use('/api/ortho_pediatric_v2', require('./tier78_ortho_ext_417_ortho_pediatric_router')); } catch(e) { console.error('ortho_pediatric_v2 mount failed', e.message); }
try { app.use('/api/ophth_general_v2', require('./tier79_ophth_ext_418_ophth_general_router')); } catch(e) { console.error('ophth_general_v2 mount failed', e.message); }
try { app.use('/api/ophth_retina_v2', require('./tier79_ophth_ext_419_ophth_retina_router')); } catch(e) { console.error('ophth_retina_v2 mount failed', e.message); }
try { app.use('/api/ophth_cataract_v2', require('./tier79_ophth_ext_420_ophth_cataract_router')); } catch(e) { console.error('ophth_cataract_v2 mount failed', e.message); }
try { app.use('/api/ophth_glaucoma_v2', require('./tier79_ophth_ext_421_ophth_glaucoma_router')); } catch(e) { console.error('ophth_glaucoma_v2 mount failed', e.message); }
try { app.use('/api/ophth_pediatric_v2', require('./tier79_ophth_ext_422_ophth_pediatric_router')); } catch(e) { console.error('ophth_pediatric_v2 mount failed', e.message); }
try { app.use('/api/ent_general_v2', require('./tier80_ent_ext_423_ent_general_router')); } catch(e) { console.error('ent_general_v2 mount failed', e.message); }
try { app.use('/api/ent_sinus_v2', require('./tier80_ent_ext_424_ent_sinus_router')); } catch(e) { console.error('ent_sinus_v2 mount failed', e.message); }
try { app.use('/api/ent_throat_v2', require('./tier80_ent_ext_425_ent_throat_router')); } catch(e) { console.error('ent_throat_v2 mount failed', e.message); }
try { app.use('/api/ent_head_neck_v2', require('./tier80_ent_ext_426_ent_head_neck_router')); } catch(e) { console.error('ent_head_neck_v2 mount failed', e.message); }
try { app.use('/api/ent_pediatric_v2', require('./tier80_ent_ext_427_ent_pediatric_router')); } catch(e) { console.error('ent_pediatric_v2 mount failed', e.message); }
try { app.use('/api/uro_general_v2', require('./tier81_uro_ext_428_uro_general_router')); } catch(e) { console.error('uro_general_v2 mount failed', e.message); }
try { app.use('/api/uro_renal_v2', require('./tier81_uro_ext_429_uro_renal_router')); } catch(e) { console.error('uro_renal_v2 mount failed', e.message); }
try { app.use('/api/uro_onco_v2', require('./tier81_uro_ext_430_uro_onco_router')); } catch(e) { console.error('uro_onco_v2 mount failed', e.message); }
try { app.use('/api/uro_peds_v2', require('./tier81_uro_ext_431_uro_peds_router')); } catch(e) { console.error('uro_peds_v2 mount failed', e.message); }
try { app.use('/api/uro_andrology_v2', require('./tier81_uro_ext_432_uro_andrology_router')); } catch(e) { console.error('uro_andrology_v2 mount failed', e.message); }
try { app.use('/api/obgyn_antenatal_v2', require('./tier82_obgyn_ext_433_obgyn_antenatal_router')); } catch(e) { console.error('obgyn_antenatal_v2 mount failed', e.message); }
try { app.use('/api/obgyn_gyne_v2', require('./tier82_obgyn_ext_434_obgyn_gyne_router')); } catch(e) { console.error('obgyn_gyne_v2 mount failed', e.message); }
try { app.use('/api/obgyn_onc_v2', require('./tier82_obgyn_ext_435_obgyn_onc_router')); } catch(e) { console.error('obgyn_onc_v2 mount failed', e.message); }
try { app.use('/api/obgyn_labor_v2', require('./tier82_obgyn_ext_436_obgyn_labor_router')); } catch(e) { console.error('obgyn_labor_v2 mount failed', e.message); }
try { app.use('/api/obgyn_repro_v2', require('./tier82_obgyn_ext_437_obgyn_repro_router')); } catch(e) { console.error('obgyn_repro_v2 mount failed', e.message); }
try { app.use('/api/derm_general_v2', require('./tier83_derm_ext_438_derm_general_router')); } catch(e) { console.error('derm_general_v2 mount failed', e.message); }
try { app.use('/api/derm_onc_v2', require('./tier83_derm_ext_439_derm_onc_router')); } catch(e) { console.error('derm_onc_v2 mount failed', e.message); }
try { app.use('/api/derm_immuno_v2', require('./tier83_derm_ext_440_derm_immuno_router')); } catch(e) { console.error('derm_immuno_v2 mount failed', e.message); }
try { app.use('/api/derm_cosmetic_v2', require('./tier83_derm_ext_441_derm_cosmetic_router')); } catch(e) { console.error('derm_cosmetic_v2 mount failed', e.message); }
try { app.use('/api/derm_peds_v2', require('./tier83_derm_ext_442_derm_peds_router')); } catch(e) { console.error('derm_peds_v2 mount failed', e.message); }
try { app.use('/api/psych_general_v2', require('./tier84_psych_ext_443_psych_general_router')); } catch(e) { console.error('psych_general_v2 mount failed', e.message); }
try { app.use('/api/psych_anxiety_v2', require('./tier84_psych_ext_444_psych_anxiety_router')); } catch(e) { console.error('psych_anxiety_v2 mount failed', e.message); }
try { app.use('/api/psych_mood_v2', require('./tier84_psych_ext_445_psych_mood_router')); } catch(e) { console.error('psych_mood_v2 mount failed', e.message); }
try { app.use('/api/psych_sud_v2', require('./tier84_psych_ext_446_psych_sud_router')); } catch(e) { console.error('psych_sud_v2 mount failed', e.message); }
try { app.use('/api/psych_emerg_v2', require('./tier84_psych_ext_447_psych_emerg_router')); } catch(e) { console.error('psych_emerg_v2 mount failed', e.message); }
try { app.use('/api/pain_acute_v2', require('./tier85_pain_ext_448_pain_acute_router')); } catch(e) { console.error('pain_acute_v2 mount failed', e.message); }
try { app.use('/api/pain_chronic_v2', require('./tier85_pain_ext_449_pain_chronic_router')); } catch(e) { console.error('pain_chronic_v2 mount failed', e.message); }
try { app.use('/api/pain_procedures_v2', require('./tier85_pain_ext_450_pain_procedures_router')); } catch(e) { console.error('pain_procedures_v2 mount failed', e.message); }
try { app.use('/api/pain_rehab_v2', require('./tier85_pain_ext_451_pain_rehab_router')); } catch(e) { console.error('pain_rehab_v2 mount failed', e.message); }
try { app.use('/api/pain_specialty_v2', require('./tier85_pain_ext_452_pain_specialty_router')); } catch(e) { console.error('pain_specialty_v2 mount failed', e.message); }
try { app.use('/api/card_heart_failure_v2', require('./tier86_card_ext_453_card_heart_failure_router')); } catch(e) { console.error('card_heart_failure_v2 mount failed', e.message); }
try { app.use('/api/card_intervention_v2', require('./tier86_card_ext_454_card_intervention_router')); } catch(e) { console.error('card_intervention_v2 mount failed', e.message); }
try { app.use('/api/card_imaging_v2', require('./tier86_card_ext_455_card_imaging_router')); } catch(e) { console.error('card_imaging_v2 mount failed', e.message); }
try { app.use('/api/card_rehab_v2', require('./tier86_card_ext_456_card_rehab_router')); } catch(e) { console.error('card_rehab_v2 mount failed', e.message); }
try { app.use('/api/card_arrhythmia_v2', require('./tier86_card_ext_457_card_arrhythmia_router')); } catch(e) { console.error('card_arrhythmia_v2 mount failed', e.message); }
try { app.use('/api/neph_general_v2', require('./tier87_neph_ext_458_neph_general_router')); } catch(e) { console.error('neph_general_v2 mount failed', e.message); }
try { app.use('/api/neph_dialysis_v2', require('./tier87_neph_ext_459_neph_dialysis_router')); } catch(e) { console.error('neph_dialysis_v2 mount failed', e.message); }
try { app.use('/api/neph_nephrology_v2', require('./tier87_neph_ext_460_neph_nephrology_router')); } catch(e) { console.error('neph_nephrology_v2 mount failed', e.message); }
try { app.use('/api/neph_geri_v2', require('./tier87_neph_ext_461_neph_geri_router')); } catch(e) { console.error('neph_geri_v2 mount failed', e.message); }
try { app.use('/api/neph_advanced_v2', require('./tier87_neph_ext_462_neph_advanced_router')); } catch(e) { console.error('neph_advanced_v2 mount failed', e.message); }
try { app.use('/api/id_general_v2', require('./tier88_id_general_463_router')); } catch(e) { console.error('id_general_v2 mount failed', e.message); }
try { app.use('/api/id_syndromes_v2', require('./tier88_id_syndromes_464_router')); } catch(e) { console.error('id_syndromes_v2 mount failed', e.message); }
try { app.use('/api/gi_luminal_v2', require('./tier88_gi_luminal_465_router')); } catch(e) { console.error('gi_luminal_v2 mount failed', e.message); }
try { app.use('/api/gi_liver_v2', require('./tier88_gi_liver_466_router')); } catch(e) { console.error('gi_liver_v2 mount failed', e.message); }
try { app.use('/api/id_specialty_v2', require('./tier88_id_specialty_467_router')); } catch(e) { console.error('id_specialty_v2 mount failed', e.message); }
try { app.use('/api/oncology_chemo_v2', require('./tier89_oncology_chemo_468_router')); } catch(e) { console.error('oncology_chemo_v2 mount failed', e.message); }
try { app.use('/api/oncology_radiation_v2', require('./tier89_oncology_radiation_469_router')); } catch(e) { console.error('oncology_radiation_v2 mount failed', e.message); }
try { app.use('/api/hematology_benign_v2', require('./tier89_hematology_benign_470_router')); } catch(e) { console.error('hematology_benign_v2 mount failed', e.message); }
try { app.use('/api/oncology_support_v2', require('./tier89_oncology_support_471_router')); } catch(e) { console.error('oncology_support_v2 mount failed', e.message); }
try { app.use('/api/oncology_survivorship_v2', require('./tier89_oncology_survivorship_472_router')); } catch(e) { console.error('oncology_survivorship_v2 mount failed', e.message); }
try { app.use('/api/genetics_cancer_v2', require('./tier90_genetics_cancer_473_router')); } catch(e) { console.error('genetics_cancer_v2 mount failed', e.message); }
try { app.use('/api/genetics_rare_v2', require('./tier90_genetics_rare_474_router')); } catch(e) { console.error('genetics_rare_v2 mount failed', e.message); }
try { app.use('/api/genetics_adult_v2', require('./tier90_genetics_adult_475_router')); } catch(e) { console.error('genetics_adult_v2 mount failed', e.message); }
try { app.use('/api/genetics_counseling_v2', require('./tier90_genetics_counseling_476_router')); } catch(e) { console.error('genetics_counseling_v2 mount failed', e.message); }
try { app.use('/api/genetics_lab_v2', require('./tier90_genetics_lab_477_router')); } catch(e) { console.error('genetics_lab_v2 mount failed', e.message); }
try { app.use('/api/geriatric_assessment_v2', require('./tier91_geriatric_assessment_478_router')); } catch(e) { console.error('geriatric_assessment_v2 mount failed', e.message); }
try { app.use('/api/geriatric_falls_v2', require('./tier91_geriatric_falls_479_router')); } catch(e) { console.error('geriatric_falls_v2 mount failed', e.message); }
try { app.use('/api/geriatric_polypharmacy_v2', require('./tier91_geriatric_polypharmacy_480_router')); } catch(e) { console.error('geriatric_polypharmacy_v2 mount failed', e.message); }
try { app.use('/api/geriatric_dementia_v2', require('./tier91_geriatric_dementia_481_router')); } catch(e) { console.error('geriatric_dementia_v2 mount failed', e.message); }
try { app.use('/api/geriatric_palliative_v2', require('./tier91_geriatric_palliative_482_router')); } catch(e) { console.error('geriatric_palliative_v2 mount failed', e.message); }
try { app.use('/api/immunodeficiency_v2', require('./tier92_immunodeficiency_483_router')); } catch(e) { console.error('immunodeficiency_v2 mount failed', e.message); }
try { app.use('/api/allergy_clinical_v2', require('./tier92_allergy_clinical_484_router')); } catch(e) { console.error('allergy_clinical_v2 mount failed', e.message); }
try { app.use('/api/immunology_lab_v2', require('./tier92_immunology_lab_485_router')); } catch(e) { console.error('immunology_lab_v2 mount failed', e.message); }
try { app.use('/api/immunotherapy_v2', require('./tier92_immunotherapy_486_router')); } catch(e) { console.error('immunotherapy_v2 mount failed', e.message); }
try { app.use('/api/autoimmune_v2', require('./tier92_autoimmune_487_router')); } catch(e) { console.error('autoimmune_v2 mount failed', e.message); }
try { app.use('/api/rheumatoid_v2', require('./tier93_rheumatoid_488_router')); } catch(e) { console.error('rheumatoid_v2 mount failed', e.message); }
try { app.use('/api/spondyloarthropathy_v2', require('./tier93_spondyloarthropathy_489_router')); } catch(e) { console.error('spondyloarthropathy_v2 mount failed', e.message); }
try { app.use('/api/crystal_arthritis_v2', require('./tier93_crystal_arthritis_490_router')); } catch(e) { console.error('crystal_arthritis_v2 mount failed', e.message); }
try { app.use('/api/connective_tissue_v2', require('./tier93_connective_tissue_491_router')); } catch(e) { console.error('connective_tissue_v2 mount failed', e.message); }
try { app.use('/api/vasculitis_v2', require('./tier93_vasculitis_492_router')); } catch(e) { console.error('vasculitis_v2 mount failed', e.message); }
try { app.use('/api/pulm_function_v2', require('./tier94_pulm_function_493_router')); } catch(e) { console.error('pulm_function_v2 mount failed', e.message); }
try { app.use('/api/pulm_sleep_v2', require('./tier94_pulm_sleep_494_router')); } catch(e) { console.error('pulm_sleep_v2 mount failed', e.message); }
try { app.use('/api/pulm_interstitial_v2', require('./tier94_pulm_interstitial_495_router')); } catch(e) { console.error('pulm_interstitial_v2 mount failed', e.message); }
try { app.use('/api/pulm_vascular_v2', require('./tier94_pulm_vascular_496_router')); } catch(e) { console.error('pulm_vascular_v2 mount failed', e.message); }
try { app.use('/api/pulm_pleural_v2', require('./tier94_pulm_pleural_497_router')); } catch(e) { console.error('pulm_pleural_v2 mount failed', e.message); }
try { app.use('/api/hepatology_viral_v2', require('./tier95_hepatology_viral_498_router')); } catch(e) { console.error('hepatology_viral_v2 mount failed', e.message); }
try { app.use('/api/hepatology_cirrhosis_v2', require('./tier95_hepatology_cirrhosis_499_router')); } catch(e) { console.error('hepatology_cirrhosis_v2 mount failed', e.message); }
try { app.use('/api/hepatology_liver_failure_v2', require('./tier95_hepatology_liver_failure_500_router')); } catch(e) { console.error('hepatology_liver_failure_v2 mount failed', e.message); }
try { app.use('/api/hepatology_pediatric_v2', require('./tier95_hepatology_pediatric_501_router')); } catch(e) { console.error('hepatology_pediatric_v2 mount failed', e.message); }
try { app.use('/api/hepatology_metabolic_v2', require('./tier95_hepatology_metabolic_502_router')); } catch(e) { console.error('hepatology_metabolic_v2 mount failed', e.message); }
try { app.use('/api/diabetes_t1dm_v2', require('./tier96_diabetes_t1dm_503_router')); } catch(e) { console.error('diabetes_t1dm_v2 mount failed', e.message); }
try { app.use('/api/diabetes_t2dm_v2', require('./tier96_diabetes_t2dm_504_router')); } catch(e) { console.error('diabetes_t2dm_v2 mount failed', e.message); }
try { app.use('/api/thyroid_extended_v2', require('./tier96_thyroid_extended_505_router')); } catch(e) { console.error('thyroid_extended_v2 mount failed', e.message); }
try { app.use('/api/adrenal_pituitary_v2', require('./tier96_adrenal_pituitary_506_router')); } catch(e) { console.error('adrenal_pituitary_v2 mount failed', e.message); }
try { app.use('/api/bone_metabolic_v2', require('./tier96_bone_metabolic_507_router')); } catch(e) { console.error('bone_metabolic_v2 mount failed', e.message); }
try { app.use('/api/neph_acute_v2', require('./tier97_neph_acute_508_router')); } catch(e) { console.error('neph_acute_v2 mount failed', e.message); }
try { app.use('/api/neph_glomerular_v2', require('./tier97_neph_glomerular_509_router')); } catch(e) { console.error('neph_glomerular_v2 mount failed', e.message); }
try { app.use('/api/neph_vascular_v2', require('./tier97_neph_vascular_510_router')); } catch(e) { console.error('neph_vascular_v2 mount failed', e.message); }
try { app.use('/api/neph_dialysis_v2', require('./tier97_neph_dialysis_511_router')); } catch(e) { console.error('neph_dialysis_v2 mount failed', e.message); }
try { app.use('/api/neph_imaging_v2', require('./tier97_neph_imaging_512_router')); } catch(e) { console.error('neph_imaging_v2 mount failed', e.message); }
try { app.use('/api/cardio_acute_v2', require('./tier98_cardio_acute_513_router')); } catch(e) { console.error('cardio_acute_v2 mount failed', e.message); }
try { app.use('/api/cardio_imaging_v2', require('./tier98_cardio_imaging_514_router')); } catch(e) { console.error('cardio_imaging_v2 mount failed', e.message); }
try { app.use('/api/cardio_intervention_v2', require('./tier98_cardio_intervention_515_router')); } catch(e) { console.error('cardio_intervention_v2 mount failed', e.message); }
try { app.use('/api/cardio_ep_v2', require('./tier98_cardio_electrophysiology_516_router')); } catch(e) { console.error('cardio_ep_v2 mount failed', e.message); }
try { app.use('/api/cardio_valve_v2', require('./tier98_cardio_valve_517_router')); } catch(e) { console.error('cardio_valve_v2 mount failed', e.message); }
try { app.use('/api/icu_extended_v2', require('./tier99_icu_extended_518_router')); } catch(e) { console.error('icu_extended_v2 mount failed', e.message); }
try { app.use('/api/ed_extended_v2', require('./tier99_ed_extended_519_router')); } catch(e) { console.error('ed_extended_v2 mount failed', e.message); }
try { app.use('/api/perioperative_v2', require('./tier99_perioperative_520_router')); } catch(e) { console.error('perioperative_v2 mount failed', e.message); }
try { app.use('/api/rehab_v2', require('./tier99_rehab_521_router')); } catch(e) { console.error('rehab_v2 mount failed', e.message); }
try { app.use('/api/oncology_extended_v2', require('./tier99_oncology_extended_522_router')); } catch(e) { console.error('oncology_extended_v2 mount failed', e.message); }
try { app.use('/api/obgyn_mfm_v2', require('./tier100_obgyn_mfm_523_router')); } catch(e) { console.error('obgyn_mfm_v2 mount failed', e.message); }
try { app.use('/api/obgyn_gyn_onc_v2', require('./tier100_obgyn_gyn_onc_524_router')); } catch(e) { console.error('obgyn_gyn_onc_v2 mount failed', e.message); }
try { app.use('/api/obgyn_rei_v2', require('./tier100_obgyn_rei_525_router')); } catch(e) { console.error('obgyn_rei_v2 mount failed', e.message); }
try { app.use('/api/obgyn_menopause_v2', require('./tier100_obgyn_menopause_526_router')); } catch(e) { console.error('obgyn_menopause_v2 mount failed', e.message); }
try { app.use('/api/obgyn_reproductive_v2', require('./tier100_obgyn_reproductive_527_router')); } catch(e) { console.error('obgyn_reproductive_v2 mount failed', e.message); }
try { app.use('/api/peds_neonatal_v2', require('./tier101_peds_neonatal_528_router')); } catch(e) { console.error('peds_neonatal_v2 mount failed', e.message); }
try { app.use('/api/peds_picu_v2', require('./tier101_peds_picu_529_router')); } catch(e) { console.error('peds_picu_v2 mount failed', e.message); }
try { app.use('/api/peds_cardiology_v2', require('./tier101_peds_cardiology_530_router')); } catch(e) { console.error('peds_cardiology_v2 mount failed', e.message); }
try { app.use('/api/peds_pulmonology_v2', require('./tier101_peds_pulmonology_531_router')); } catch(e) { console.error('peds_pulmonology_v2 mount failed', e.message); }
try { app.use('/api/peds_development_v2', require('./tier101_peds_development_532_router')); } catch(e) { console.error('peds_development_v2 mount failed', e.message); }
try { app.use('/api/surg_general_v2', require('./tier102_surg_general_533_router')); } catch(e) { console.error('surg_general_v2 mount failed', e.message); }
try { app.use('/api/surg_oncology_v2', require('./tier102_surg_oncology_534_router')); } catch(e) { console.error('surg_oncology_v2 mount failed', e.message); }
try { app.use('/api/surg_vascular_v2', require('./tier102_surg_vascular_535_router')); } catch(e) { console.error('surg_vascular_v2 mount failed', e.message); }
try { app.use('/api/surg_trauma_v2', require('./tier102_surg_trauma_536_router')); } catch(e) { console.error('surg_trauma_v2 mount failed', e.message); }
try { app.use('/api/surg_transplant_v2', require('./tier102_surg_transplant_537_router')); } catch(e) { console.error('surg_transplant_v2 mount failed', e.message); }
try { app.use('/api/pathology_v2', require('./tier103_pathology_538_router')); } catch(e) { console.error('pathology_v2 mount failed', e.message); }
try { app.use('/api/radiology_extended_v2', require('./tier103_radiology_extended_539_router')); } catch(e) { console.error('radiology_extended_v2 mount failed', e.message); }
try { app.use('/api/nuclear_medicine_v2', require('./tier103_nuclear_medicine_540_router')); } catch(e) { console.error('nuclear_medicine_v2 mount failed', e.message); }
try { app.use('/api/lab_management_v2', require('./tier103_lab_management_541_router')); } catch(e) { console.error('lab_management_v2 mount failed', e.message); }
try { app.use('/api/blood_bank_v2', require('./tier103_blood_bank_542_router')); } catch(e) { console.error('blood_bank_v2 mount failed', e.message); }
try { app.use('/api/quality_v2', require('./tier104_quality_543_router')); } catch(e) { console.error('quality_v2 mount failed', e.message); }
try { app.use('/api/compliance_v2', require('./tier104_compliance_544_router')); } catch(e) { console.error('compliance_v2 mount failed', e.message); }
try { app.use('/api/epidemiology_v2', require('./tier104_epidemiology_545_router')); } catch(e) { console.error('epidemiology_v2 mount failed', e.message); }
try { app.use('/api/public_health_v2', require('./tier104_public_health_546_router')); } catch(e) { console.error('public_health_v2 mount failed', e.message); }
try { app.use('/api/qi_v2', require('./tier104_qi_547_router')); } catch(e) { console.error('qi_v2 mount failed', e.message); }
try { app.use('/api/research_v2', require('./tier104_research_548_router')); } catch(e) { console.error('research_v2 mount failed', e.message); }
try { app.use('/api/telemedicine_v2', require('./tier104_telemedicine_549_router')); } catch(e) { console.error('telemedicine_v2 mount failed', e.message); }
try { app.use('/api/scheduling_v2', require('./tier105_scheduling_550_router')); } catch(e) { console.error('scheduling_v2 mount failed', e.message); }
try { app.use('/api/billing_ext_v2', require('./tier105_billing_extended_551_router')); } catch(e) { console.error('billing_ext_v2 mount failed', e.message); }
try { app.use('/api/insurance_v2', require('./tier105_insurance_552_router')); } catch(e) { console.error('insurance_v2 mount failed', e.message); }
try { app.use('/api/administrative_v2', require('./tier105_administrative_553_router')); } catch(e) { console.error('administrative_v2 mount failed', e.message); }
try { app.use('/api/communication_v2', require('./tier105_communication_554_router')); } catch(e) { console.error('communication_v2 mount failed', e.message); }
try { app.use('/api/er_ext_v2', require('./tier106_er_extended_555_router')); } catch(e) { console.error('er_ext_v2 mount failed', e.message); }
try { app.use('/api/trauma_center_v2', require('./tier106_trauma_center_556_router')); } catch(e) { console.error('trauma_center_v2 mount failed', e.message); }
try { app.use('/api/disaster_v2', require('./tier106_disaster_557_router')); } catch(e) { console.error('disaster_v2 mount failed', e.message); }
try { app.use('/api/poison_control_v2', require('./tier106_poison_control_558_router')); } catch(e) { console.error('poison_control_v2 mount failed', e.message); }
try { app.use('/api/pre_hospital_v2', require('./tier106_pre_hospital_559_router')); } catch(e) { console.error('pre_hospital_v2 mount failed', e.message); }
try { app.use('/api/nursing_assess_v2', require('./tier107_nursing_assess_561_router')); } catch(e) { console.error('nursing_assess_v2 mount failed', e.message); }
try { app.use('/api/nursing_med_admin_v2', require('./tier107_nursing_med_admin_562_router')); } catch(e) { console.error('nursing_med_admin_v2 mount failed', e.message); }
try { app.use('/api/wound_care_v2', require('./tier107_wound_care_563_router')); } catch(e) { console.error('wound_care_v2 mount failed', e.message); }
try { app.use('/api/iv_therapy_v2', require('./tier107_iv_therapy_564_router')); } catch(e) { console.error('iv_therapy_v2 mount failed', e.message); }
try { app.use('/api/allied_health_v2', require('./tier107_allied_health_565_router')); } catch(e) { console.error('allied_health_v2 mount failed', e.message); }
try { app.use('/api/ct_advanced_v2', require('./tier108_ct_advanced_566_router')); } catch(e) { console.error('ct_advanced_v2 mount failed', e.message); }
try { app.use('/api/mri_advanced_v2', require('./tier108_mri_advanced_567_router')); } catch(e) { console.error('mri_advanced_v2 mount failed', e.message); }
try { app.use('/api/ultrasound_advanced_v2', require('./tier108_ultrasound_advanced_568_router')); } catch(e) { console.error('ultrasound_advanced_v2 mount failed', e.message); }
try { app.use('/api/imaging_ai_v2', require('./tier108_imaging_ai_569_router')); } catch(e) { console.error('imaging_ai_v2 mount failed', e.message); }
try { app.use('/api/imaging_quality_v2', require('./tier108_imaging_quality_570_router')); } catch(e) { console.error('imaging_quality_v2 mount failed', e.message); }
try { app.use('/api/pain_mgmt_v2', require('./tier109_pain_management_571_router')); } catch(e) { console.error('pain_mgmt_v2 mount failed', e.message); }
try { app.use('/api/palliative_care_v2', require('./tier109_palliative_care_572_router')); } catch(e) { console.error('palliative_care_v2 mount failed', e.message); }
try { app.use('/api/spine_care_v2', require('./tier109_spine_care_573_router')); } catch(e) { console.error('spine_care_v2 mount failed', e.message); }
try { app.use('/api/sports_medicine_v2', require('./tier109_sports_medicine_574_router')); } catch(e) { console.error('sports_medicine_v2 mount failed', e.message); }
try { app.use('/api/sleep_medicine_v2', require('./tier109_sleep_medicine_575_router')); } catch(e) { console.error('sleep_medicine_v2 mount failed', e.message); }
try { app.use('/api/pharmacy_clinical_v2', require('./tier110_pharmacy_clinical_580_router')); } catch(e) { console.error('pharmacy_clinical_v2 mount failed', e.message); }
try { app.use('/api/antimicrobial_stewardship_v2', require('./tier110_antimicrobial_stewardship_581_router')); } catch(e) { console.error('antimicrobial_stewardship_v2 mount failed', e.message); }
try { app.use('/api/chemotherapy_pharmacy_v2', require('./tier110_chemotherapy_pharmacy_582_router')); } catch(e) { console.error('chemotherapy_pharmacy_v2 mount failed', e.message); }
try { app.use('/api/adverse_drug_reaction_v2', require('./tier110_adverse_drug_reaction_583_router')); } catch(e) { console.error('adverse_drug_reaction_v2 mount failed', e.message); }
try { app.use('/api/medication_safety_v2', require('./tier110_medication_safety_584_router')); } catch(e) { console.error('medication_safety_v2 mount failed', e.message); }
try { app.use('/api/cardiac_cath_v2', require('./tier111_cardiac_cath_585_router')); } catch(e) { console.error('cardiac_cath_v2 mount failed', e.message); }
try { app.use('/api/cardiac_rehab_v2', require('./tier111_cardiac_rehab_586_router')); } catch(e) { console.error('cardiac_rehab_v2 mount failed', e.message); }
try { app.use('/api/electrophysiology_v2', require('./tier111_electrophysiology_587_router')); } catch(e) { console.error('electrophysiology_v2 mount failed', e.message); }
try { app.use('/api/dialysis_v2', require('./tier111_dialysis_588_router')); } catch(e) { console.error('dialysis_v2 mount failed', e.message); }
try { app.use('/api/neuro_diag_v2', require('./tier111_neuro_diagnostic_589_router')); } catch(e) { console.error('neuro_diag_v2 mount failed', e.message); }
try { app.use('/api/infection_control_v2', require('./tier112_infection_control_590_router')); } catch(e) { console.error('infection_control_v2 mount failed', e.message); }
try { app.use('/api/pathogen_tracking_v2', require('./tier112_pathogen_tracking_591_router')); } catch(e) { console.error('pathogen_tracking_v2 mount failed', e.message); }
try { app.use('/api/immunization_v2', require('./tier112_immunization_592_router')); } catch(e) { console.error('immunization_v2 mount failed', e.message); }
try { app.use('/api/sterilization_v2', require('./tier112_sterilization_593_router')); } catch(e) { console.error('sterilization_v2 mount failed', e.message); }
try { app.use('/api/stew_extended_v2', require('./tier112_stew_extended_594_router')); } catch(e) { console.error('stew_extended_v2 mount failed', e.message); }
try { app.use('/api/ob_extended_v2', require('./tier113_ob_extended_595_router')); } catch(e) { console.error('ob_extended_v2 mount failed', e.message); }
try { app.use('/api/maternal_med_v2', require('./tier113_maternal_medicine_596_router')); } catch(e) { console.error('maternal_med_v2 mount failed', e.message); }
try { app.use('/api/reproductive_endocrine_v2', require('./tier113_reproductive_endocrine_597_router')); } catch(e) { console.error('reproductive_endocrine_v2 mount failed', e.message); }
try { app.use('/api/fertility_v2', require('./tier113_fertility_598_router')); } catch(e) { console.error('fertility_v2 mount failed', e.message); }
try { app.use('/api/gyne_onc_extended_v2', require('./tier113_gyne_oncology_extended_599_router')); } catch(e) { console.error('gyne_onc_extended_v2 mount failed', e.message); }
try { app.use('/api/anxiety_v2', require('./tier114_anxiety_600_router')); } catch(e) { console.error('anxiety_v2 mount failed', e.message); }
try { app.use('/api/mood_v2', require('./tier114_mood_601_router')); } catch(e) { console.error('mood_v2 mount failed', e.message); }
try { app.use('/api/psychotic_v2', require('./tier114_psychotic_602_router')); } catch(e) { console.error('psychotic_v2 mount failed', e.message); }
try { app.use('/api/trauma_v2', require('./tier114_trauma_603_router')); } catch(e) { console.error('trauma_v2 mount failed', e.message); }
try { app.use('/api/substance_use_v2', require('./tier114_substance_use_604_router')); } catch(e) { console.error('substance_use_v2 mount failed', e.message); }
try { app.use('/api/neurosurgery_v2', require('./tier115_neurosurgery_605_router')); } catch(e) { console.error('neurosurgery_v2 mount failed', e.message); }
try { app.use('/api/orthopedics_ext_v2', require('./tier115_orthopedics_extended_606_router')); } catch(e) { console.error('orthopedics_ext_v2 mount failed', e.message); }
try { app.use('/api/otolaryngology_v2', require('./tier115_otolaryngology_607_router')); } catch(e) { console.error('otolaryngology_v2 mount failed', e.message); }
try { app.use('/api/ophthalmology_v2', require('./tier115_ophthalmology_608_router')); } catch(e) { console.error('ophthalmology_v2 mount failed', e.message); }
try { app.use('/api/dentistry_v2', require('./tier115_dentistry_609_router')); } catch(e) { console.error('dentistry_v2 mount failed', e.message); }
try { app.use('/api/pt_extended_v2', require('./tier116_pt_extended_610_router')); } catch(e) { console.error('pt_extended_v2 mount failed', e.message); }
try { app.use('/api/ot_extended_v2', require('./tier116_ot_extended_611_router')); } catch(e) { console.error('ot_extended_v2 mount failed', e.message); }
try { app.use('/api/st_voice_v2', require('./tier116_st_voice_612_router')); } catch(e) { console.error('st_voice_v2 mount failed', e.message); }
try { app.use('/api/rehab_engineering_v2', require('./tier116_rehab_engineering_613_router')); } catch(e) { console.error('rehab_engineering_v2 mount failed', e.message); }
try { app.use('/api/specialty_rehab_v2', require('./tier116_specialty_rehab_614_router')); } catch(e) { console.error('specialty_rehab_v2 mount failed', e.message); }

startServer();

