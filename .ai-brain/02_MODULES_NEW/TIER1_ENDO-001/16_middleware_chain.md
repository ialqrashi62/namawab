# ENDO-001 — Middleware Chain

```text
[REQUEST]
   ↓
helmet + cors allowlist
   ↓
rate_limit (per (tenant, route, role))
   ↓
express-session (Redis+memory fallback)
   ↓
requireAuth (session or Bearer)
   ↓
requireTenantScope (set app.tenant_id via AsyncLocalStorage)
   ↓
requireRole('doctor' | 'nurse' | ...)
   ↓
validateBody(RS_ENDO_001.X)
   ↓
idempotencyGuard (only on money/claim endpoints)
   ↓
[ENGINE EXECUTE]
   ↓
audit.record({ engine, version, tenant, provider, latency, red_flag_fired, citation_count, confidence })
   ↓
[response]
```

CSP: report-only by default (rail 8).
No PHI in logs (rail 12).

---

*Owner: SA — 2026-08-01*
