# MICU — Middleware Chain

## Layered Security
```js
// 1. requireAuth — verify session/JWT
// 2. requireTenantScope — enforce tenant_id from session
// 3. requireRole — RBAC check
// 4. validateBody — fail-closed input validation
// 5. idempotencyGuard — for critical orders (medication, vent changes)
// 6. auditMiddleware — log every state change
```

## requireAuth
- **Purpose:** Verify user session or JWT
- **Source:** `req.session.userId` or `Authorization: Bearer <jwt>`
- **Failure:** 401 Unauthorized
- **Skip:** `/api/health`, `/api/login`

## requireTenantScope
- **Purpose:** Ensure user can only access data in their tenant
- **Source:** `req.tenantId` from session
- **Validation:** `tenantId IS NOT NULL` (fail-closed if missing)
- **Failure:** 403 Forbidden
- **Compliance:** Rail #5 (Tenant isolation stays on)

## requireRole
- **Purpose:** RBAC
- **Roles for MICU:**
  - `attending` (Intensivist) — full access
  - `resident` — limited orders (no high-alert without co-sign)
  - `nurse` — vitals, scores, documentation (no orders)
  - `rt` (Respiratory Therapist) — vent settings
  - `pharmacist` — medications
  - `admin` — read-only

## validateBody
- **Schema:** route_schemas.js (Joi or Zod)
- **Failure:** 400 with detail
- **Critical:** High-alert meds require dose range check
  - Norepinephrine: 0.05-1 mcg/kg/min
  - Epinephrine: 0.05-0.5 mcg/kg/min
  - Insulin drip: 0.1-0.5 U/kg/h
  - Heparin: per protocol

## idempotencyGuard
- **Applied to:** Vasoactive orders, code status change, vent change
- **Header:** `Idempotency-Key` required
- **Storage:** Redis (24h TTL)
- **Failure:** 409 if duplicate key + different body

## auditMiddleware
- **Logs:** Every state change (admission, score, med order, code status)
- **Fields:** tenant_id, user_id, action, resource_id, before/after (hash), IP, UA
- **Retention:** 7 years (regulatory)
- **Hash chain:** each row includes prev_row_hash (tamper-evident)
- **Storage:** `audit_log` table (separate schema)

## Rate Limiting
- **General:** 100 req/min per user
- **AI endpoints:** 10 req/min per user
- **Medication orders:** 30 req/min per user

## PHI Protection
- **Auto-redact:** SSN, name, MRN in logs
- **Encryption:** DICOM in phi_vault/
- **Tenant header:** Never trust client-provided tenant_id (use session)
- **CSP:** report-only by default

## Idempotency for Money/Clinical
- Vasoactive drip start (clinical critical)
- Code status change (legal critical)
- Blood product order
- High-alert medication (insulin, heparin, opioid)
- Vent setting change (life-critical)

## Compliance Hooks
- **JCI:** All access logged
- **PDPL:** PHI encrypted at rest + in transit
- **NPHIES:** No PHI to insurance without consent
- **CBAHI:** 7-year audit retention

## Order of Execution
```js
app.post('/api/micu/admissions/:id/vasoactive',
  requireAuth,                  // 1. Session
  requireTenantScope,           // 2. Tenant
  requireRole(['doctor']),      // 3. RBAC
  validateBody(RS.vasoactive),  // 4. Validation (fail-closed)
  idempotencyGuard,             // 5. Idempotency
  auditMiddleware,              // 6. Audit
  async (req, res) => { ... }   // 7. Handler
);
```

## Test Mode
- `BYPASS_AUTH=true` only in dev (NEVER in prod)
- Test tenant: separate schema
- Mock RBAC for integration tests
