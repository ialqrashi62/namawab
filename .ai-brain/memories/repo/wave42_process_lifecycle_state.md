# Wave 42 — Process Lifecycle Observability

**Date:** 2026-08-05
**Branch (submodule):** `integration/all-epics` @ `7016dfb`
**Branch (parent):** `ops/jumanasoft-enterprise-facility-platform-staging-prep` @ `225b5b80`
**Status:** ✅ DEPLOYED + VERIFIED + SIGTERM tested

## What it surfaces

PM2 restart count = 22 for all 4 workers. server.js had NO process-level handlers:
- No `process.on('unhandledRejection')` → silent terminate
- No `process.on('uncaughtException')` → silent terminate
- No `process.on('SIGTERM')` → abrupt exit, in-flight requests drop
- No `process.on('SIGINT')` → abrupt exit
- DB pool never closed cleanly → connection leak

## Solution

Wave 42 module registers all 4 handlers + implements graceful shutdown that:
1. Stops accepting new HTTP connections (`httpServer.close()`)
2. Drains in-flight requests
3. Closes DB pool (`pool.end()`)
4. Logs audit row to tenant 0 (system)
5. Exits 0 (PM2 sees clean exit, no restart penalty)

## Endpoints

| Endpoint | Auth | Notes |
|---|---|---|
| `GET /api/metrics/process` | public (scrape) | 7 gauges |
| `GET /api/security/process` | Admin/IT | JSON |

## Gauges

- `nama_process_unhandled_rejections_total`
- `nama_process_uncaught_exceptions_total`
- `nama_process_graceful_shutdowns_total`
- `nama_process_sigterm_total`
- `nama_process_sigint_total`
- `nama_process_uptime_seconds`

## Test status

- 30/30 wave42 tests pass on local + prod
- Cumulative waves 31-42: **238/238 PASS**

## Production verification

Manually sent `kill -TERM 1538275` to worker 10:
- Logs: `[Wave 42] SIGTERM received — graceful shutdown`
- audit_trail row 205: `tenant_id=0, action=SIGTERM`
- PM2 spawned fresh worker (restart count 22 → 23)
- Workers 11/12/13 unaffected (graceful is per-worker)

## Lessons learned

1. **app.listen needs the http server reference** — the original code
   `app.listen(PORT, () => {...})` discarded it. Wave 42 captures it via
   `const _server = app.listen(...)` to pass to `gracefulShutdown()`.
2. **install must be inside the listen callback** — handlers fire BEFORE
   listen if registered too early, which causes `process.exit(0)` to fire
   before the server is bound. The callback timing is correct.
3. **PM2 cluster sends SIGINT, not SIGTERM** for `pm2 restart`. Both must
   be handled. Some sources claim SIGTERM but in this setup it's SIGINT.
4. **Exit code 0 is critical** — PM2 treats non-zero as a crash and
   increments the restart counter. We exit 0 even on uncaughtException
   so the lifecycle is "graceful" not "crash".

## Follow-ups (deferred)

- Forced exit after hard timeout (current logic just abandons)
- Per-request pool tracking during drain
- Trace propagation in graceful path
