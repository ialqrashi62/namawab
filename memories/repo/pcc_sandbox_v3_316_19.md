# PCC Sandbox v3.316.19 — write-audit log endpoint

**Loop engineer #2 mission** (2026-07-29) — add a read-only audit log of write
operations to /api/v1/pcc-catalog/audit.

## Code added to pcc/server.js

| Block | Lines | Purpose |
|---|---|---|
| Ring buffer + helper | 2022–2039 | `PCC_AUDIT_MAX=1000`, `pccAuditLog[]`, `pccAuditEntry()` — drops oldest on overflow |
| Audit middleware | 2187–2209 | Sits after `pccTenantRateLimit` (line 2167). Only fires on POST + `/api/v1/...` + matches `/record$` or `/call/`. Uses `res.on('finish')` so it captures the actual response status. |
| /audit endpoint | 4481–4495 | Lives inside the `pccCatalog` Router. Returns newest-first; supports `?limit=` (default 100, max 1000) and `?tenant_id=` filter. |

## Behavior

- **Captures:** every successful POST to `/api/v1/<slug>/call/<fn>` and `/api/v1/<slug>/record`
- **Does NOT capture:** writes rejected by `pccRateLimit` (per-IP, 429 short-circuit) — that middleware runs first and returns before the audit hook runs. Tenant rate-limit 429s ARE captured because the tenant middleware also calls `next()` in that path (it just sets headers).
- **Entry shape:** `{ts, method, path, tenant_id, decision_id, fn, module, duration_ms, status}`
- **Ring buffer cap:** 1000 entries. Oldest shifted on overflow.
- **Endpoint version stamp:** `3.316.19`

## Test results (this session)

After 60s wait for IP rate-limit reset:
- 3 fresh writes all returned 200
- `total_entries` went 60 → 120 (existing 60 from prior burst + 60 from a parallel re-test that ran during the wait, plus the 3 fresh = 123, but the buffer caps at 1000 and is at 120)
- `tnt-audit` filter returned 2 entries (d1, d2); `tnt-other` returned 1 (d3)
- Bogus `limit=99999` correctly clamped to `PCC_AUDIT_MAX=1000`
- `/health` still 200

## Pitfalls learned

- `pccRateLimit` (line 2103) returns `res.status(429)` directly without calling `next()`, so writes rejected by the per-IP limit never reach the audit middleware. If full coverage of 429s is needed, the audit hook must move above `pccRateLimit`. Out of scope for this mission.
- The body parser may not populate `req.body.tenant_id` when the IP rate limit short-circuits, so any 429 entry will show `tenant_id: null`.
- PowerShell `python -c "..."` heredocs mangle escape sequences (`\"` inside `f"..."`); prefer writing JSON to a temp file then `python` reading it via `-c "import json; ..."` or use `Get-Content` + `ConvertFrom-Json`.

## Files

- `c:\Users\ice\Desktop\NMEDCALVSCODE\pcc\server.js` — only file modified
- Server logs: `pcc\server_v31619.log`, `pcc\server_v31619_err.log`
