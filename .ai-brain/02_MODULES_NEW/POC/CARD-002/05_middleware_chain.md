<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — Middleware Chain

## Global Chain (app.use for /api/v1/cath-lab)
`
[Request] → authenticate (session JWT) → requireTenantScope (GATE4) → corsWithAllowlist → rateLimit({200, '1m'}) → auditMiddleware → [Route]
`

## Per-Route Chain (example: POST /procedures)
`
[Request] → authenticate → requireTenantScope → requireRole('cardiology') → validateBody(RS.cathLab.cathProcedure) → idempotencyGuard → [Controller]
`

## Middleware Definitions (from SNIPPETS.md)

### authenticate
- Verify session JWT
- Reject 401 if invalid/expired
- Attach eq.session.user

### requireTenantScope
- Per AGENTS.md GATE 4: session > header
- Read 	enant_id from eq.session.user.tenant_id
- Reject 403 if missing in production
- Set eq.tenant_id
- Set current_setting('app.tenant_id') in transaction

### requireRole(roles)
- Per Golden Access Rule: Owner/Admin = all; others = specialty
- oles can be array
- Reject 403 if not in roles

### validateBody(schema)
- Fail-closed: if body invalid, 400 + validation error
- Per SNIPPETS.md pattern
- Pre-validate before idempotency

### idempotencyGuard
- Per SNIPPETS.md#SNIP-07
- ONLY for money/SFDA routes
- Read Idempotency-Key header
- If exists in cache (24h) → return cached response
- If new → generate UUID, store on success
- Fail-open if cache down (log + proceed)

### auditMiddleware
- Per SNIPPETS.md#SNIP-08
- Inert by default (set AUDIT_ENABLED_TENANTS to enable)
- Hash-chained audit (input/output hash + prev_hash)
- 7+ year retention

## RLS at DB Layer
- All 12 tables have FORCE ROW LEVEL SECURITY
- Policy: USING (tenant_id = current_setting('app.tenant_id')::UUID)
- Defense-in-depth: even if middleware bypassed, DB blocks

## Error Handling
- All errors logged to cath_audit_log (if enabled)
- 4xx: client error (no retry)
- 5xx: server error (alert, retry possible)
- 429: rate limit exceeded
- 401: re-authenticate
- 403: RBAC denied

---
*Section 32 of CARD-002. DSL voice. L1 DRAFT.*