---
module_id: ER-001
section: 03_technical_arch
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Middleware Chain + Data Flow

## Middleware Chain (per ER route)

```javascript
// Applied in order (server.js mount)
app.use('/api/er', 
  authenticate,           // 1. Session validation (JWT)
  requireTenantScope,     // 2. Tenant context from session (GATE4 anti-spoof)
  corsWithAllowlist,      // 3. CORS check
  rateLimit({requests: 200, period: '1m'}),  // 4. Rate limit per user
  requireRole([...]),     // 5. RBAC (role-based)
  validateBody(RS.er),    // 6. Fail-closed input validation
  auditMiddleware,        // 7. Hash-chained audit (GATE3-M1, inert by default)
  erRouter                // 8. Route handlers
);
```

### Per-middleware details

#### 1. authenticate
- Validates JWT or session cookie
- Sets `req.user` (id, role, tenant_id, facility_id)
- Sets `req.tenant_id` from session (overrides any header)
- **Security:** 401 if invalid, 403 if expired session
- **Audit:** login success/failure

#### 2. requireTenantScope
- Source: `req.user.tenant_id` (session) — NOT from `X-Tenant-ID` header (GATE4)
- Sets AsyncLocalStorage context (`db_postgres.js`)
- All subsequent DB queries: `WHERE tenant_id = $1` (auto-injected)
- **Fail-closed:** if `req.tenant_id` missing, throw 500
- **Critical:** prevents cross-tenant data leaks

#### 3. corsWithAllowlist
- Whitelist: tenant-specific allowed origins
- Block: preflight failures, missing Origin header
- **Strict:** no wildcards, no credentials without explicit allow

#### 4. rateLimit
- Per-user: 200 req/min (default)
- Per-tenant: 10,000 req/min
- Sliding window (last 60s)
- **Backoff:** exponential for repeat offenders
- **Block:** temporary IP ban for sustained abuse

#### 5. requireRole(['MD', 'RN', 'PA', 'NP'])
- Check user role against allowed list
- Sub-role check: MD subspecialty (e.g., EM attending vs resident)
- **Audit:** unauthorized access attempt (even if 403)

#### 6. validateBody(RS.er)
- JSON schema validation (from `route_schemas.js`)
- Fail-closed: any validation error → 422
- **Critical paths** (triage, code activation, medication): strict schema
- **Optional fields:** default values applied
- **PHI fields:** encrypted before insert

#### 7. auditMiddleware (inert by default)
- Hash-chained audit log
- Records: user_id, tenant_id, action, resource, before/after state
- **Inert by default:** not enabled in production unless flag set
- **When enabled:** every state change logged to `er_audit_log`

#### 8. erRouter
- Route handler
- `req.audit(action, payload)` for critical operations
- Returns JSON response
- **Error handling:** try/catch, log, return 5xx with generic message

## Data Flow — Triage Example

```
┌─────────┐    POST /api/er/triage      ┌──────────┐
│ Browser │  {patient_id, vitals, ...}  │ Express  │
│ (RN UI) ├────────────────────────────►│  Router  │
└─────────┘                              └─────┬────┘
                                                │
              ┌─────────────────────────────────┼─────────────────────────────────┐
              │                                 │                                 │
              ▼                                 ▼                                 ▼
        ┌───────────┐                    ┌──────────────┐                  ┌────────────┐
        │  Auth     │                    │  RBAC        │                  │  Validate  │
        │  Check    │                    │  (RN/MD)     │                  │  (schema)  │
        └─────┬─────┘                    └──────┬───────┘                  └──────┬─────┘
              │ set req.user                    │ pass                          │ pass
              ▼                                 ▼                                ▼
        ┌────────────────────────────────────────────────────────────────────────────┐
        │                  Tenant Context: req.tenant_id = 'uuid-tenant-A'            │
        │                  (from session, not header — GATE4)                        │
        └─────────────────────────────────────┬──────────────────────────────────────┘
                                              │
                                              ▼
        ┌────────────────────────────────────────────────────────────────────────────┐
        │                        ER Router (er_routes.js)                             │
        │                                                                             │
        │  1. Call er_engine.classifyESI(patient)                                     │
        │     └─> Pure function, no I/O                                              │
        │     └─> Returns: {esi_level, red_flags, recommended_action, ...}          │
        │                                                                             │
        │  2. If ESI 1-2: create encounter                                            │
        │     └─> DB INSERT INTO er_encounters (tenant_id injected)                  │
        │     └─> DB INSERT INTO er_triage_decisions                                 │
        │                                                                             │
        │  3. Log audit (if enabled)                                                  │
        │     └─> DB INSERT INTO er_audit_log (hash-chained)                         │
        │                                                                             │
        │  4. Return response                                                         │
        │     └─> {esi_level, red_flags, encounter_id, ...}                          │
        └─────────────────────────────────────┬──────────────────────────────────────┘
                                              │
                                              ▼
        ┌─────────┐   JSON response        ┌──────────┐
        │ Browser │  {esi_level, red_flags,│ Database │
        │  UI     │   encounter_id, ...}   │ (PG)     │
        └────┬────┘                        └──────────┘
             │
             ▼
        ┌──────────────────┐
        │  RN sees ESI 1   │
        │  → patient to    │
        │    Resus Bay     │
        │  (auto-page team)│
        └──────────────────┘
```

## Critical Paths (Hardened)

### 1. Triage → Code Activation
- Triage ESI 1-2 → auto-create encounter
- MD can activate code (blue/stemi/stroke/trauma/sepsis)
- Code activation → page team + update encounter.is_critical
- All in single transaction (atomic)
- Audit hash-chained

### 2. Medication Administration
- Allergy check (block if match)
- Drug interaction check (block if critical)
- Renal dose adjustment (recommend, can override)
- Pregnancy check (block if teratogen)
- 5-rights verification
- Witness required for high-alert drugs

### 3. Disposition → Admission
- Disposition 'admit' → trigger ADT (admission/transfer/discharge) workflow
- Bed assignment + ward transfer
- Handoff documentation
- Insurance pre-auth (NPHIES)

## Security Boundaries

### Trust Boundary 1: Browser ↔ Server
- TLS 1.3 (HTTPS only)
- CORS allowlist (no wildcards)
- CSP report-only by default
- CSRF token for state-changing operations

### Trust Boundary 2: Server ↔ Database
- RLS enabled + forced (FORCE_RLS=150)
- App role = `nama_medical_app` (non-superuser)
- All queries tenant-scoped
- Connection pooling + prepared statements (SQL injection prevention)

### Trust Boundary 3: Server ↔ External APIs
- NPHIES (KSA insurance): mTLS, JWT, IP allowlist
- ZATCA (e-invoicing): CSID, OTP, signed UBL
- LLM providers (OpenAI, Anthropic): PII redaction BEFORE send
- Drug databases (RxNorm, DrugBank): API key in Vault

### Trust Boundary 4: PHI at Rest
- Envelope encryption (DPAPI KEK) for columns
- DICOM files in `phi_vault/` outside webroot
- No PHI in logs (mask or omit)
- Audit log hash-chained + WORM storage

## Request Tracing
- All requests: `X-Request-Id` (UUID)
- Logged at every middleware
- Traceable through async operations
- Used for debugging + audit correlation

## Error Response Format
```json
{
  "error": "TRIAGE_FAILED",
  "message": "Triage classification failed",
  "request_id": "uuid",
  "timestamp": "2026-07-23T10:00:00Z"
}
```

Never include:
- Stack traces (info leak)
- SQL queries (info leak)
- Internal paths
- Other users' data

---
*Section 03.e of ER-001. Owner: SA + DSL. L4 validated.*
