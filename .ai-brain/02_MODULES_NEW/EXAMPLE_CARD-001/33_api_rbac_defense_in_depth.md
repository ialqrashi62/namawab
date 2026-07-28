# 33 — API RBAC Defense-in-Depth (CARD-001)

> Owner: DSL · Tier 1

## Layered defense

| Layer | Control | Cardiology-specific |
|-------|---------|---------------------|
| 1. Network | CORS allowlist + CSP report-only | jumanasoft.com + tenants |
| 2. Transport | HTTPS only (HTTP for staging only) | Let's Encrypt cert |
| 3. Session | express-session + Redis + secure cookie + MFA | required for cardiologists |
| 4. Authn | requireAuth | session valid + MFA verified |
| 5. Tenant | requireTenantScope (RLS) | RLS policy at DB level |
| 6. Role | requireRole('cardiology') | specialty-scoped |
| 7. Validation | validateBody(zod) | fail-closed |
| 8. Idempotency | idempotencyGuard (money) | cath, device, NPHIES |
| 9. Audit | audit_middleware (CRITICAL for red_flag) | hash-chained |
| 10. Data | crypto_envelope (PHI) | ECG, echo, cath files |

## Role matrix

| Action | patient | nurse | tech | cardio | cardio_senior | admin | er | anesthesia | surgery |
|--------|---------|-------|------|--------|---------------|-------|----|-----------| --------|
| Read own encounter | R | R | R | R | R | R | R | R | R |
| Read any encounter (own tenant) | — | R (assigned) | R (assigned) | R | R | R | R (if ER) | R (if preop) | R (if preop) |
| Create encounter | — | — | — | C | C | — | C | — | — |
| Update encounter (own) | — | — | — | U | U | U | U | — | — |
| Sign encounter | — | — | — | S | S | — | S | — | — |
| Read ECG | R (own) | R (assigned) | R (assigned) | R | R | R | R | R | R |
| Upload ECG | — | — | C | C | C | — | C | — | — |
| Interpret ECG | — | — | D (draft) | S | S | — | S | — | — |
| Read echo | R (own) | R (assigned) | R (assigned) | R | R | R | R | R | R |
| Upload echo | — | — | C | C | C | — | C | — | — |
| Sign echo | — | — | — | S | S | — | — | — | — |
| Read stress / holter | R (own) | R | R | R | R | R | R | R | R |
| Create cath | — | — | — | C | C | — | C (CODE) | — | — |
| Sign cath | — | — | — | S | S | — | — | — | — |
| Implant device | — | — | — | C | C | — | — | — | — |
| Read rehab plan | R (own) | R | — | R | R | R | — | — | — |
| Use co-pilot | R (own) | R (assigned) | R (assigned) | R | R | — | R | R | R |
| Activate red flag | R (own) | R (assigned) | R (assigned) | C | C | — | C | C | C |
| Sign off red flag (4-eye) | — | — | — | S | S | — | — | — | — |
| Read NPHIES claim | R (own) | — | — | R (if signer) | R | R | — | — | — |
| Submit NPHIES claim | — | — | — | — | — | C | — | — | — |
| Read audit log | — | — | — | — | R (own actions) | R | R (own actions) | R (own) | R (own) |
| Read LLM trace | — | — | — | R (own) | R (own) | R | R (own) | R (own) | R (own) |

R = read, C = create, U = update, S = sign, D = draft, — = no access.

## Cross-tenant

- All access strictly tenant-scoped. No cross-tenant without explicit grant.
- Admin/owner can request cross-tenant view (logged CRITICAL).
- Co-pilot queries: strictly same-tenant.

## Cross-specialty

- ER doctor can read cardiology encounters (for ER patients) but cannot edit.
- Anesthesia can read preop cardiac clearance.
- Surgery can read cath reports if their patient.
- Cross-specialty write: requires `cross_specialty_grant` (4-eye, audit).

## Audit (snippet:audit-hash)

- All POST/PUT/DELETE: hash-chained
- All red_flag activations: CRITICAL priority
- All LLM queries: trace_id + cost
- All NPHIES claims: claim_id + amount + status
- All role changes: CRITICAL priority
- 7+ year retention

## Failure modes

| Failure | Detection | Response |
|---------|-----------|----------|
| Missing tenant | requireTenantScope | 403 |
| Missing role | requireRole | 403 |
| Cross-tenant access | RLS | 403 + log |
| Cross-specialty write | requireRole + grants | 403 + log |
| Invalid body | validateBody | 400 |
| Idempotency conflict | idempotencyGuard | 200 (original) |
| LLM service down | timeout | 503 + retry |
| NPHIES down | claim status | queue + retry |
| Audit log down | write-fail | 503 (fail-closed) |
