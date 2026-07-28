# 16 — Middleware Chain (CARD-001)

> Owner: SA · Snippet: snippet:safety-gate · Tier 1

## Global chain (applies to all routes)

```yaml
global:
  - helmet                                    # security headers
  - cors_allowlist                            # CORS allowlist
  - csp_report_only                           # CSP report-only (snippet:csp-report-only)
  - rate_limit                                # express-rate-limit
  - session                                   # express-session (Redis + MemoryStore)
  - request_id                                # X-Request-Id
  - audit_middleware                          # opt-in (snippet:audit-hash)
```

## Cardiology protected chain

```yaml
protected:
  - requireAuth
  - requireTenantScope           # defense-in-depth (snippet:rls-default)
  - requireRole('cardiology')    # Golden Access Rule
  - validateBody(RS.<schema>)    # fail-closed
  - idempotencyGuard             # ONLY on money/claim routes
```

## Per-route middleware matrix

| Route | Auth | T | Role | VB | IDM | Audit |
|-------|------|---|------|----|----|-------|
| GET cardiology/encounters | yes | yes | yes | — | — | opt |
| POST cardiology/encounters | yes | yes | yes | yes | — | yes |
| POST cardiology/ecg | yes | yes | yes | yes | — | yes |
| POST cardiology/cath | yes | yes | yes | yes | yes | yes |
| POST cardiology/devices | yes | yes | yes | yes | yes | yes |
| POST cardiology/copilot/query | yes | yes | yes | yes | — | yes (LLM trace) |
| POST cardiology/red-flags/:id/activate | yes | yes | yes | yes | yes | yes (CRITICAL) |
| POST cardiology/nphies/claim | yes | yes | yes | yes | yes | yes (CRITICAL) |

## Fail-closed behavior

- Missing tenant context in production → 403
- Missing role → 403
- Invalid body → 400
- Idempotency key collision (within 24h) → return original response
- Redis down + IDM route → fail-open + warn
- LLM service down → 503 with retry-after

## Audit (snippet:audit-hash)

- All POST/PUT/DELETE: hash-chained entry written
- All red-flag activations: CRITICAL priority entry
- All LLM queries: trace_id + cost + tokens
- All NPHIES claims: claim_id + amount + status
- Retention: 7+ years
- Per-tenant: separate chain (no cross-tenant)
