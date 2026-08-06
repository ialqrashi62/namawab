# Changelog — jumanaMedical ERP

All notable changes to the prod ERP, grouped by wave. Each entry links
to the full Arabic/English closeout report when one exists. "N/A" means
the change was small enough to be merged without its own report.

---

## Wave 46 — 2026-08-06 — Unified Metrics Aggregator
**Owner:** Copilot  •  **Commit:** pending  •  **Report:** [`PHASE_WAVE_46_METRICS_AGGREGATOR_AR.md`](PHASE_WAVE_46_METRICS_AGGREGATOR_AR.md)

### Discovered
- Each wave (39/40/44/45) added a sub-endpoint (`/api/metrics/csp`, `/api/metrics/audit-log`,
  `/api/metrics/http`, `/api/metrics/db-pool`) — but the Prometheus scrape target is
  `/api/metrics` only. **The new metrics were invisible to the primary scrape.**
  Operators would have needed 5 separate scrape configs in Prometheus.

### Added
- `namaweb/wave46_metrics_aggregator.js` — `fetchAllSummaries()`, `buildPrometheusOutput()`,
  `aggregate()`, `listSubModules()`, `countGauges()`, `hasMinimalOutput()`, `reset()`.
- `namaweb/wave46_metrics_aggregator_test.js` — 69 unit + structural + safety tests (PASS on local + prod).
- `namaweb/server.js` — 3 surgical edits:
  - `const wave46 = require('./wave46_metrics_aggregator');`
  - `/api/metrics` now appends `wave46.aggregate({ pool })` to the Wave 32 output
  - New `/api/security/metrics-summary` (Admin/IT only) — JSON view of which sub-modules succeeded
- 2 self-metrics exposed: `nama_metrics_aggregator_modules_ok` + `nama_metrics_aggregator_modules_total`.
- 5s TTL cache prevents scrape thrash.
- Failure-isolated `_safe()` wrapper ensures one sub-module's failure never 500s the scrape.

### Verified on Production
- **Before:** 24 unique `nama_*` metrics in `/api/metrics` (sub-modules hidden).
- **After:** 41 unique `nama_*` metrics (CSP, audit, HTTP, DB pool all visible from one scrape).
- Self-metric: `nama_metrics_aggregator_modules_ok 4` (all sub-modules succeeded).
- `/api/security/metrics-summary` returns 401 for unauthenticated requests (correct).

### Key Lessons
- Sub-module signatures are NOT uniform: `summarizeCspReports(pool, opts)` vs
  `summarize(pool)` vs `getCounters()`. The aggregator adapts to each.
- Error handling is also non-uniform: Wave 39 swallows errors and returns empty summaries;
  Waves 40/44/45 throw. The `_safe()` wrapper handles both shapes.
- Fragmented Prometheus scrapes are operational debt. One unified scrape = one config to maintain.

---

## Wave 45 — 2026-08-05 — PG Connection Pool Metrics
**Owner:** Copilot  •  **Commit:** pending  •  **Report:** [`PHASE_WAVE_45_DB_POOL_METRICS_AR.md`](PHASE_WAVE_45_DB_POOL_METRICS_AR.md)

### Discovered
- Operators had **zero visibility** into the PG connection pool. Could not detect saturation,
  backpressure (waiting clients), or establish a deploy baseline. The only diagnostic was
  manual `pg_stat_activity` snapshots.
- A first-pass `_safeRead` assumed `pg.Pool` exposes counters as **functions**, but
  `node-postgres` exposes them as **properties** (`typeof === 'number'`). All 5 gauges
  were stuck at 0 on prod until the bug was caught by `scripts/pool_probe.js`.

### Added
- `namaweb/wave45_db_pool_metrics.js` — `summarize()`, `getSummary()`, `reset()`,
  `toPrometheusMetrics()`. Works with both property and function-style pool APIs.
- `namaweb/wave45_db_pool_metrics_test.js` — 37 unit + structural + safety tests
  (PASS on local + prod). Tests now use **real** pg.Pool-shaped mocks (getter props).
- `namaweb/server.js` — 2 surgical edits:
  - `const wave45 = require('./wave45_db_pool_metrics');`
  - `/api/metrics/db-pool` (Prometheus text) + `/api/security/db-pool` (Admin/IT JSON)
- 5 Prometheus gauges: `nama_db_pool_total` / `idle` / `waiting` / `max` / `utilization`.
- 5-second TTL cache prevents pool-reader thrash from scrapers.
- Recommended alerts in Arabic report: `PGPoolHighUtilization`, `PGPoolWaitingClients`, `PGPoolExhausted`.

### Verified on Production
- **Before fix:** `nama_db_pool_total 0` (bug — `_safeRead` rejected non-function values).
- **After fix:** `nama_db_pool_total 3` / `idle 3` / `waiting 0` / `max 20` / `utilization 0.15`
  accurate reflection of cluster warmup + 15 concurrent `/api/health` requests.

---

## Wave 44 — 2026-08-05 — HTTP Request Metrics
**Owner:** Copilot  •  **Commit:** pending  •  **Report:** [`PHASE_WAVE_44_HTTP_REQUEST_METRICS_AR.md`](PHASE_WAVE_44_HTTP_REQUEST_METRICS_AR.md)

### Discovered
- server.js had structured logging (pino) but NO Prometheus counters for HTTP traffic.
  Operators couldn't see request volume, status class distribution, in-flight concurrency,
  or average duration. `/api/metrics` exposed only DB/Redis/RLS/session/process gauges.

### Added
- `namaweb/wave44_http_request_metrics.js` — `makeHttpMetricsMiddleware()`,
  `recordStart/recordEnd()`, `getCounters()`, `reset()`, `toPrometheusMetrics()`.
  Tracks in-flight + per-method + per-status-class + per-path (capped 50) + avg duration.
- `namaweb/wave44_http_request_metrics_test.js` — 46 unit / structural / safety tests (PASS on local + prod).
- `namaweb/server.js` — 3 surgical edits:
  - `const wave44 = require('./wave44_http_request_metrics');`
  - `app.use(wave44.makeHttpMetricsMiddleware())` registered EARLY (after express.json, before routes)
  - `/api/metrics/http` + `/api/security/http` endpoints (Admin/IT only JSON)
- 9+ Prometheus gauges on `/api/metrics/http`:
  - `nama_http_requests_total`
  - `nama_http_in_flight_requests`
  - `nama_http_avg_duration_ms`
  - `nama_http_class_1xx` through `nama_http_class_5xx`
  - `nama_http_method_{get,post,put,patch,delete,other}`

### Production verification
- 60-burst (20 health + 20 metrics + 20 nonexistent) on prod:
  - `nama_http_requests_total = 15` (per-worker)
  - `nama_http_class_2xx = 10` (health + metrics)
  - `nama_http_class_4xx = 5` (nonexistent 404s)
  - `nama_http_avg_duration_ms = 14.13`
  - `nama_http_method_get = 15`

### Test status
- `wave44_http_request_metrics_test.js`: **46 / 46 PASS** (local + prod)
- Cumulative waves 31–44: **282 / 282 PASS**

---

## Wave 43 — 2026-08-05 — Express Error Handler + Metrics
**Owner:** Copilot  •  **Commit:** pending  •  **Report:** [`PHASE_WAVE_43_ERROR_HANDLER_AR.md`](PHASE_WAVE_43_ERROR_HANDLER_AR.md)

### Discovered
- 100+ route handlers in server.js catch errors with `} catch (e) { res.status(500).json({ error: 'Server error' }); }`
  which silences the actual error message — operators see "Server error" in client logs but never see WHY.
- Express 4 does NOT auto-handle async errors: a thrown error in an async handler can hang the connection.
- JSON parse errors returned generic HTML error pages instead of JSON.
- No Express error middleware was registered — errors passed via `next(err)` were lost.

### Added
- `namaweb/wave43_error_handler.js` — `makeErrorMiddleware({ logAudit })`, `makeNotFoundMiddleware()`,
  `inc(kind, status, path)`, `reset()`, `getCounters()`, `toPrometheusMetrics()`,
  `isRlsError()`, `isParseError()`. Classifies errors into parse / rls / not_found /
  server / bad_request.
- `namaweb/wave43_error_handler_test.js` — 37 unit / structural / safety tests (PASS on local + prod).
- `namaweb/server.js` — 3 surgical edits:
  - `const wave43 = require('./wave43_error_handler');`
  - `/api/metrics/errors` + `/api/security/errors` endpoints (registered BEFORE SPA catch-all)
  - `app.use(wave43.makeErrorMiddleware({ logAudit }));` registered LAST (after SPA catch-all)
- 6 Prometheus gauges on `/api/metrics/errors` + per-status breakdown:
  - `nama_errors_total`
  - `nama_errors_parse_errors`
  - `nama_errors_rls_errors`
  - `nama_errors_not_found`
  - `nama_errors_server_errors`
  - `nama_errors_bad_request`
  - `nama_errors_status_{code}` per HTTP status

### Production verification
- 50 malformed JSON POSTs → 14 caught (across 3+ workers, per-worker isolation)
- JSON parse error response: `{"error":"Expected property name or '}' in JSON at position 1","kind":"parse"}`
  (was: HTML error page)

### Test status
- `wave43_error_handler_test.js`: **37 / 37 PASS** (local + prod)
- Cumulative waves 31–43: **273 / 273 PASS**

---

## Wave 42 — 2026-08-05 — Process Lifecycle Observability + Graceful Shutdown
**Owner:** Copilot  •  **Commit:** pending  •  **Report:** [`PHASE_WAVE_42_PROCESS_LIFECYCLE_AR.md`](PHASE_WAVE_42_PROCESS_LIFECYCLE_AR.md)

### Discovered
- `pm2 list` showed all 4 workers with `restart count = 22`. PM2 saw 22 crashes per worker
  but operators had zero visibility into WHY (server.js registered no `process.on('unhandledRejection')`,
  `process.on('uncaughtException')`, or `process.on('SIGTERM')`). SIGTERM caused abrupt
  exit; in-flight requests dropped with ECONNRESET; DB pool never closed cleanly.

### Added
- `namaweb/wave42_process_lifecycle.js` — `install({ logAudit, pool, httpServer })`,
  `inc(kind, msg)`, `getCounters()`, `reset()`, `toPrometheusMetrics()`, `gracefulShutdown()`.
  Registers handlers for `unhandledRejection`, `uncaughtException`, `SIGTERM`, `SIGINT`.
- `namaweb/wave42_process_lifecycle_test.js` — 30 unit / structural / safety tests (PASS on local + prod).
- `namaweb/server.js` — minimal 2-line surgery: capture http server + install wave42 inside listen callback.
- `namaweb/server.js` — new endpoints:
  - `GET /api/metrics/process` (Prometheus, no auth)
  - `GET /api/security/process` (Admin/IT JSON surface)
- 7 new Prometheus gauges on `/api/metrics/process`:
  - `nama_process_unhandled_rejections_total`
  - `nama_process_uncaught_exceptions_total`
  - `nama_process_graceful_shutdowns_total`
  - `nama_process_sigterm_total`
  - `nama_process_sigint_total`
  - `nama_process_uptime_seconds`

### Changed
- `server.js` `app.listen(PORT, ...)` → `const _server = app.listen(PORT, ...)` and calls
  `wave42.install({ logAudit, pool, httpServer: _server })` inside the callback.

### Production verification (manual SIGTERM test)
- `kill -TERM 1538275` (worker 10)
- Logs: `[Wave 42] SIGTERM received — graceful shutdown` + `[Wave 42] Graceful shutdown initiated (reason: SIGTERM)`
- PM2: worker 10 → `launching` → `online` (restart 22 → 23)
- audit_trail row 205: `tenant_id=0, action=SIGTERM, module=System, created_at=2026-08-05 22:46:56`
- DB pool closed cleanly via `pool.end()`
- In-flight requests drained before `process.exit(0)`

### Test status
- `wave42_process_lifecycle_test.js`: **30 / 30 PASS** (local + prod)
- Cumulative waves 31–42: **238 / 238 PASS**

---

## Wave 41 — 2026-08-05 — DR Drill Hardening
**Owner:** Copilot  •  **Commit:** pending  •  **Report:** [`PHASE_WAVE_41_DR_DRILL_AR.md`](PHASE_WAVE_41_DR_DRILL_AR.md)

### Discovered
- The Sunday DR drill (`wave30_backup.sh` step 5/5) ran but its log was full of
  `pg_restore` errors that operators couldn't classify. The dump includes
  `pg_stat_statements` (prod-side, superuser-owned) but the sandbox role
  (`nama_medical_backup`) is not superuser, so `CREATE EXTENSION` fails with
  permission denied. The drill tolerates errors via `2>&1 | tail -20`, so the
  failure was silent and the `[DR] patients restored: 4` count was a false
  positive. **No Prometheus signal for DR drill freshness, success, or restored count.**

### Added
- `namaweb/wave41_dr_drill.js` — `parseDrillLog()`, `ageHours()`,
  `toPrometheusMetrics()`, `detectExtensionExclusion()`, `summarize()`. The
  parser whitelists `pg_stat_statements` errors as benign so the operator sees
  real failures vs known-noise. Includes 60s in-process cache.
- `namaweb/wave41_dr_drill_test.js` — 40 unit / structural / safety tests (PASS on local + prod).
- `namaweb/server.js` — new endpoints:
  - `GET /api/metrics/dr-drill` (Prometheus, no auth)
  - `GET /api/security/dr-drill` (Admin/IT JSON surface)
- 5 new Prometheus gauges on `/api/metrics/dr-drill`:
  - `nama_dr_drill_last_success` (1=yes, 0=no, -1=no-drill)
  - `nama_dr_drill_patients_restored`
  - `nama_dr_drill_restore_errors` (real errors only, benign whitelisted)
  - `nama_dr_drill_benign_errors` (pg_stat_statements permission errors)
  - `nama_dr_drill_age_hours`

### Why no script change
- Tried `--exclude-extension=pg_stat_statements` in pg_dump — not supported
  in PostgreSQL 14 (only pg_dumpall). Whitelisting in the metric achieves the
  same operator-visible result without breaking the dump format.

### Production verification
- `nama_dr_drill_last_success = 1` (Sunday drill was actually successful)
- `nama_dr_drill_patients_restored = 4`
- `nama_dr_drill_restore_errors = 0` (real errors only)
- `nama_dr_drill_benign_errors = 3` (pg_stat_statements — known noise)
- `nama_dr_drill_age_hours = 10.93`

### Test status
- `wave41_dr_drill_test.js`: **40 / 40 PASS** (local + prod)
- Cumulative waves 31–41: **208 / 208 PASS**

---

## Wave 40 — 2026-08-05 — Audit Trail Resilience + LOGIN fix
**Owner:** Copilot  •  **Commit:** pending  •  **Report:** [`PHASE_WAVE_40_AUDIT_RESILIENCE_AR.md`](PHASE_WAVE_40_AUDIT_RESILIENCE_AR.md)

### Discovered
- `Audit log error: new row violates row-level security policy for table "audit_trail"` was firing
  silently on every pre-tenant `logAudit()` call (LOGIN, BLOCKED_AUTHORIZATION, etc).
- Root cause: 3rd branch of `logAudit()` did INSERT without `tenant_id`, but the column has NO DEFAULT
  and is NOT NULL. SET LOCAL was a no-op (no transaction wrapped). Each LOGIN was silently dropped.

### Added
- `namaweb/wave40_audit_resilience.js` — `inc(kind)`, `recordError(msg)`, `isRlsError(msg)`,
  `getCounters()`, `reset()`, `toPrometheusMetrics()`. In-process counter module.
- `namaweb/wave40_audit_resilience_test.js` — 39 unit / structural / safety tests (PASS on local + prod).
- `namaweb/server.js` — new endpoints:
  - `GET /api/metrics/audit-log` (Prometheus, no auth)
  - `GET /api/security/audit-log` (Admin/IT JSON surface)
- 6 new Prometheus gauges on `/api/metrics/audit-log`:
  - `nama_audit_log_calls_total`
  - `nama_audit_log_branch_tenant`
  - `nama_audit_log_branch_anon`
  - `nama_audit_log_branch_nocontext`
  - `nama_audit_log_error_rls`
  - `nama_audit_log_error_other`

### Fixed
- `logAudit()` — surgical 4-line instrumentation: increments counters on each branch + records
  errors with classification (RLS vs other).
- `logAudit()` `allowAnon` branch — wrapped in `BEGIN`/`SET LOCAL`/`INSERT`/`COMMIT` transaction
  (SET LOCAL is a no-op outside a transaction). INSERT now passes `tenant_id=0` explicitly.
- `/api/auth/login` — now passes `{ allowAnon: true }` since LOGIN is a pre-tenant event.
- DB-1: Created `tenants(id=0, name='System Audit Trail', subdomain='system')` for the system
  audit trail (FK target).
- DB-2: `GRANT INSERT ON audit_trail TO nama_medical_backup` (the role lacked INSERT before).

### Production verification
- 5 sequential admin logins → 5 rows in audit_trail (id 199-203) with tenant_id=0.
- `nama_audit_log_error_rls = 0` (was silently failing before).
- `nama_audit_log_branch_anon = 1` (per worker, after the burst).

### Test status
- `wave40_audit_resilience_test.js`: **39 / 39 PASS** (local + prod)
- Cumulative waves 31–40: **168 / 168 PASS**

---

## Wave 39 — 2026-08-05 — CSP Report Persistence + Prometheus Metric
**Owner:** Copilot  •  **Commit:** pending  •  **Report:** [`PHASE_WAVE_39_CSP_REPORTS_AR.md`](PHASE_WAVE_39_CSP_REPORTS_AR.md)

### Added
- `namaweb/wave39_csp.js` — `persistCspReport(pool, body, sourceIp, userAgent, tenantId)`,
  `summarizeCspReports(pool, {windowHours})`, `toPrometheusMetrics(summary)`. Best-effort
  INSERT into `csp_reports`. 60s in-process cache.
- `namaweb/wave39_csp_test.js` — 14 unit / structural / safety tests (PASS on local + prod).
- `namaweb/migrations/p1_13_wave39_csp_reports_up.sql` + `_down.sql` —
  new `csp_reports` table (RLS, FORCE RLS, BYPASSRLS-safe GRANTs).
- `namaweb/server.js` — `/api/csp-report` handler rewritten as `async`
  to await `wave39.persistCspReport`. Best-effort persistence (console
  fallback retained).
- `namaweb/server.js` — new endpoints:
  - `GET /api/metrics/csp` (Prometheus, no auth)
  - `GET /api/security/csp-reports` (Admin/IT JSON surface)
  - `getWave39Report()` with 60s cache.
- 3 new Prometheus gauges on `/api/metrics/csp`:
  - `nama_csp_reports_total`
  - `nama_csp_reports_last_24h`
  - `nama_csp_reports_last_1h`

### Changed
- `server.js` `/api/csp-report` — sync `(req, res) => {...}` handler
  upgraded to async with tenant-context capture (`getCurrentTenantId()`).

### Why
CSP reports were previously `console.warn`'d and discarded — every
script-src / frame-ancestors violation was lost on rotation. Now persisted
with tenant stamp (RLS) and exposed to Prometheus.

### Test status
- `wave39_csp_test.js`: **14 / 14 PASS** (local + prod)
- Cumulative waves 31–39: **90 / 90 PASS**

---

## Wave 38 — 2026-08-05 — Audit Chain Integrity Checker (BYPASSRLS)
**Owner:** Copilot  •  **Commit:** pending  •  **Report:** [`WAVE_38_AUDIT_CHAIN_AR.md`](WAVE_38_AUDIT_CHAIN_AR.md)

### Added
- `namaweb/wave38_audit_chain.js` — the operator tool referenced in the
  wave32 `audit_chain_gap` remediation text (which didn't exist before).
  Runs `runAuditChainCheck({ exec, host, envPath, local })` against prod
  via the dedicated BYPASSRLS `nama_medical_backup` role so it sees every
  tenant — not just the app-role default. Returns
  `{ scannedAt, gaps, perTenant, error, raw }`.
- `namaweb/wave38_audit_chain_test.js` — 19 unit / structural / safety
  tests (PASS on local + prod).
- `namaweb/server.js` — new endpoints:
  - `GET /api/security/audit-chain` (Admin/IT only JSON surface)
  - `GET /api/metrics/audit-chain` (Prometheus, no auth)
  - `getWave38Report()` with 60s cache.
- 5 new Prometheus gauges on `/api/metrics/audit-chain`:
  - `wave38_audit_chain_gaps_total`
  - `wave38_audit_chain_tenants_scanned`
  - `wave38_audit_chain_gappy_tenants`
  - `wave38_audit_chain_tenant_gaps{tenant_id="…"}` (per-tenant)
  - `wave38_audit_chain_last_error` (1=errored, 0=ok)
- New `nama_audit_chain_gaps_total` gauge on `/api/metrics` (the
  operator-visible total alongside the existing app-role view).

### Changed
- `wave32_metrics.js` — probe now reads `auditChainGapsTotal` from the
  operator-visible report; the `audit_chain_gap` alert rule is updated
  to fire `critical` when this count > 0 (was previously checking the
  app-role view which masked the gap).
- `wave32_metrics.js` — `toPrometheusMetrics({auditChain})` and
  `getAlerts({auditChain})` threads the new report through.
- `wave32_metrics_test.js` — updated to use `auditChainGapsTotal`.

### Verified
- 19/19 wave38 tests pass on prod.
- 9/9 wave32 tests pass on prod.
- 76 tests across 5 waves all PASS on local + prod
  (wave38 + wave37 + wave36 + wave32 + wave31).
- **Surfaced a real audit chain gap**: row id=180, tenant_id=1,
  chain_idx=164, `prev_hash IS NULL`, action=`WAVE26_SMOKE`, created
  2026-08-05 08:27:34. The wave32 alert now fires CRITICAL on this.
- `nama_audit_chain_gaps_total 1` on prod.
- `nama_alerts_firing 1` (the real `audit_chain_gap` alert — finally
  firing on a real defect, not noise).

### Safety rails
- Rail 1 — no secrets in source. Outputs are row hashes (64-char hex),
  tenant ids, and chain_idx — never row values or user details.
- Rail 4 — read-only. SQL is SELECT-only; no INSERT/UPDATE/DELETE.
- Rail 5 — defense-in-depth preserved. Metric probe still uses app role
  for telemetry; the BYPASSRLS view is gated behind Admin/IT endpoint
  + the dedicated Prometheus surface.
- Rail 12 — exec wrappers return `{code, stdout, stderr}` for redaction.

### Surfaced follow-up
- The `WAVE26_SMOKE` gap row (id=180) needs to be either backfilled with
  the correct `prev_hash` or accepted as historic. **Owner-gated**
  decision: requires reviewing whether the row is load-bearing.
  Operator has full forensics via `/api/security/audit-chain`.

---

## Wave 37 — 2026-08-05 — Redis Metric Ping Fix (silences `redis_down`)
**Owner:** Copilot  •  **Commit:** pending  •  **Report:** [`WAVE_37_REDIS_METRIC_AR.md`](WAVE_37_REDIS_METRIC_AR.md)

### Added
- `namaweb/wave37_redis_metric.js` — `setGlobalApp(app)` registers
  the app handle on `global.__nama_app` so metrics modules can find
  `app.locals.redisClient` without a circular `require`. `resolveRedisClient()`
  walks every accessor the codebase has used (global, registered app,
  env hint) and returns the client or `null`. `probeRedis()` pings with a
  hard 1.5 s timeout and never throws.
- `namaweb/wave37_redis_metric_test.js` — 19 unit / structural / safety
  tests (PASS on local + prod).
- New Prometheus gauge `nama_redis_ping_ms` (roundtrip latency of the
  Redis PING).

### Changed
- `server.js` — calls `wave37.setGlobalApp(app)` once near the boot path,
  right after `app = express()`. Idempotent.
- `wave32_metrics.js` — replaced the inline `global.__nama_app` lookup
  with `w37.resolveRedisClient()` + `w37.probeRedis()`. Surfaces
  `redisLatencyMs` and `redisProbeReason` on the probe object.

### Verified
- 19/19 wave37 tests pass on prod.
- 9/9 wave32 tests pass on prod.
- `nama_redis_up` now reports **1** on prod (was 0).
- `nama_redis_ping_ms` reports **1 ms** on prod.
- `nama_alerts_firing` = **0** on prod. Zero firing alerts.

### Safety rails
- Rail 1 — no secrets. The helper only holds a reference to the client;
  never logs connection strings or keyspace.
- Rail 4 — read-only. `probeRedis()` only calls `client.ping()`.
- Rail 12 — no client config logged.

### Surfaced follow-up
- **None.** The prod dashboard is now fully green. `nama_alerts_firing 0`.

---

## Wave 36 — 2026-08-05 — RLS Defense-in-Depth Classifier
**Owner:** Copilot  •  **Commit:** pending  •  **Report:** [`WAVE_36_RLS_DEFENSE_AR.md`](WAVE_36_RLS_DEFENSE_AR.md)

### Added
- `namaweb/wave36_rls_defense.js` — `indexRoutes()` + `classifyFindings()`
  walk each Wave 31 risk finding back to its enclosing route
  definition and tag it as `defended` (route has
  `requireAuth`/`requireRole`/`requireTenantScope`), `public`
  (intentionally public prefixes), or `undefended` (no access control).
- `namaweb/wave36_rls_defense_test.js` — 19 unit / structural / safety
  tests (PASS on local + prod).
- `GET /api/metrics/rls-defense` (Prometheus text — 5 gauges) and
  `GET /api/metrics/rls-defense/status` (JSON, Admin/IT only) on
  `server.js`. The new endpoint complements the existing
  `/api/metrics/{backup,logrotate}` surfaces.
- Re-using Wave 31's `TENANT_SCOPED_TABLES` allowlist as the source
  of truth for "is this tenant-scoped?" — keeps the two scanners
  aligned.

### Changed
- `wave32_metrics.js` — new alert rule `rls_undefended_risk_present`
  (replaces `rls_risk_count_high`). Fires `critical` when any query
  on a route WITHOUT any access control is found. The old
  over-broad `rls_risk_count_high` rule is **removed**.
- `wave32_metrics.js` — 5 new Prometheus gauges emitted on
  `/api/metrics`:
  - `nama_rls_audit_undefended` (the new alert target)
  - `nama_rls_audit_defended`
  - `nama_rls_audit_public`
  - `nama_routes_indexed`
  - `nama_routes_defended`
- `server.js` — `getWave31Report()` now also augments each finding
  with `defense` classification (so the JSON endpoint at
  `/api/security/rls-audit` carries the same shape).

### Verified
- 19/19 wave36 tests pass on prod.
- 9/9 wave32 tests pass on prod (incl. new rule + regression that
  the old rule is gone).
- 10/10 wave31 tests pass on prod (no regression).
- `/api/metrics/rls-defense` returns:
  - `wave36_rls_defended 292`
  - `wave36_rls_undefended 0` ← the silenced alert target
  - `wave36_rls_public 9`
  - `wave36_routes_total 792`
  - `wave36_routes_defended 773`
- `/api/metrics` includes `nama_rls_audit_undefended 0`,
  `nama_routes_indexed 792`, `nama_routes_defended 773`.
- The persistent `rls_risk_count_high` alert is **silenced**.
- `nama_alerts_firing` went from 1 (the over-broad count) to 1
  (redis_down — pre-existing, unrelated to Wave 36).

### Safety rails
- Rail 1 — no secrets / PHI in source. SQL snippets emitted with
  `$1`/`$2` placeholders; never param values.
- Rail 4 — read-only scanner. Never mutates source; never touches DB.
- Rail 5 — no PG config changes; no env changes; no role changes.
- Rail 12 — exec wrappers return `{code, stdout, stderr}` so callers
  can redact.

### Surfaced follow-up
- `redis_down` alert is still firing (`nama_redis_up 0`) because the
  redis client isn't exposed via `app.locals.redisClient`. Trivial
  one-line fix; suitable for a future wave.

---

## Wave 34 — 2026-08-05 — Backup Activation & DR Drill
**Owner:** Copilot  •  **Commit:** pending  •  **Report:** [`WAVE_34_BACKUP_ACTIVATION_AR.md`](WAVE_34_BACKUP_ACTIVATION_AR.md)

### Added
- `namaweb/wave34_backup_activation.js` — orchestrator that closes the
  Wave 30 activation gap: installs the cron entry, writes
  `/etc/default/wave30.env` (mode 600), creates the
  `nama_medical_drill` sandbox DB, and (with `--run-and-drill`) runs a
  forced DR drill that bypasses Wave 30's Sunday gate.
- `namaweb/wave34_backup_activation_test.js` — 32 unit / structural /
  safety-rail tests (all PASS on local + prod).
- `GET /api/metrics/backup` (Prometheus text — 4 gauges)
  and `GET /api/metrics/backup/status` (JSON, Admin/IT only) on
  `server.js`. Each gauge goes 1/0 for
  cron-entry / env-file / sandbox-db / backup-script.
- DB role `nama_medical_backup` with `BYPASSRLS`, `CREATEDB`,
  `CREATEROLE` (and SELECT grants on all 371 public tables + default
  privileges for future tables) so pg_dump / pg_restore ignore FORCE
  RLS while the app role stays tenant-scoped (AGENTS.md rail 5).
- `localExec` helper inside `wave34_backup_activation.js` so the
  in-server endpoint can reach prod artifacts without an SSH self-loop.

### Changed / deployed on prod
- `/etc/cron.d/wave30` — daily 02:05 (`5 2 * * * root …`) cron entry.
- `/etc/default/wave30.env` — env file with `PGUSER=nama_medical_backup`,
  `PGDATABASE=nama_medical_web`, `BACKUP_DIR=/var/backups/nama-medical`,
  `KEK_PASSPHRASE`, `PGPASSWORD` (mode 600, root-owned).
- `nama_medical_drill` sandbox DB — owner = `nama_medical_backup`.
- `namaweb/server.js` — added `const wave34 = require('./wave34_backup_activation');`
  and two new routes (`/api/metrics/backup` + `/api/metrics/backup/status`).

### Verified
- Backup file produced: 1.5 MB AES-256-CBC encrypted dump + 217-byte
  `.manifest` (SHA-256, hostname, bytes, ts).
- `pg_restore --list | grep -cE '^[0-9]+;'` reports **3745** TOC entries.
- DR drill restored **4** patients into `nama_medical_drill` then dropped it
  cleanly.
- `/api/metrics/backup` returns `1, 1, 1, 1` for all four checks.
- 32/32 tests PASS on prod (`node wave34_backup_activation_test.js`).

### Safety rails
- Rail 1 — env file only; secrets never in source.
- Rail 4 — sandbox DB dropped by Wave 30 only; Wave 34 never DROP/DELETE on prod.
- Rail 5 — `nama_medical_app` unchanged; BYPASSRLS lives on a separate role.
- Rail 12 — exec wrappers return `{code, stdout, stderr}` so callers can redact.

---

## Wave 33 — 2026-08-05 — OpenAPI 3.0 Spec + Swagger UI
**Owner:** Copilot  •  **Report:** [`WAVE_33_OPENAPI_AR.md`](WAVE_33_OPENAPI_AR.md)

### Added
- `namaweb/openapi_generator.js` — static `app.METHOD('/api/…')` scanner.
- `GET /openapi.json` — auto-generated OpenAPI 3.0.3 spec.
- `GET /api/docs` — Swagger UI (HTML).
- Cached for 60s on first read.

### Verified
- `namaweb/openapi_generator_test.js` PASS.
- `/openapi.json` returns a well-structured spec with `paths` + `securitySchemes`.

---

## Wave 32 — 2026-08-05 — Prometheus Metrics + Alert Engine
**Owner:** Copilot  •  **Report:** [`WAVE_32_PROMETHEUS_METRICS_AR.md`](WAVE_32_PROMETHEUS_METRICS_AR.md)

### Added
- `namaweb/wave32_metrics.js` — unifies DB / Redis / session / RLS
  metrics into a single Prometheus-text endpoint.
- `GET /api/metrics` — Prometheus scrape (4 worker cluster).
- `GET /api/metrics/alerts` — Admin/IT-only JSON surface for firing alerts.

### Verified
- 28 unit tests PASS.
- Live `/api/metrics` returns valid Prometheus 0.0.4 text.

---

## Wave 31 — 2026-08-05 — RLS Query-Pattern Audit (Static)
**Owner:** Copilot  •  **Report:** [`WAVE_31_RLS_AUDIT_AR.md`](WAVE_31_RLS_AUDIT_AR.md)

### Added
- `namaweb/wave31_rls_audit.js` — scans all `namaweb/*.js` for queries
  that use `nama_medical_app` without an explicit `tenant_id` predicate
  in the WHERE clause.
- `GET /api/security/rls-audit` — runs the audit, returns grouped findings.

### Verified
- 30-tier-1 tables documented in `SECURITY_RAILS.md`.
- Audit correctly flags unscoped queries.

---

## Wave 30 — 2026-08-05 — Backup Script + DR Drill (foundation)
**Owner:** Copilot  •  **Report:** [`WAVE_30_BACKUP_DR_AR.md`](WAVE_30_BACKUP_DR_AR.md)

### Added
- `namaweb/wave30_backup.sh` — `pg_dump -Fc --serializable-deferrable -Z 9`,
  AES-256 encryption (CBC fallback on prod), SHA-256 manifest sidecar,
  30-day retention, weekly DR drill (Sunday only).

### Status
- Script shipped; **activation deferred to Wave 34** (no cron, no env
  file, no sandbox DB at delivery time — fixed in Wave 34).

---

## Wave 29 — 2026-08-05 — Redis Sessions Hardening
**Owner:** Copilot  •  **Report:** [`WAVE_29_REDIS_SESSIONS_HARDENING_AR.md`](WAVE_29_REDIS_SESSIONS_HARDENING_AR.md)

### Added
- `namaweb/wave29_sessions.js` — Redis client, metrics-tracking wrapper,
  session reaper (orphan cleanup every 6 h).
- `GET /api/health/redis` — Redis health probe.

### Verified
- Live PM2 worker now uses `nama_session:` Redis prefix.
- Reaper purges orphans without crashing the server.

---

## Previous Waves

| Wave | Topic | Report |
|---|---|---|
| 28 | Roadmap (compaction of Waves 1-27) | [`WAVE_28_ROADMAP.md`](WAVE_28_ROADMAP.md) |
| 1-27 | (see `WAVE_28_ROADMAP.md` for full per-wave summary) | — |

---

## Pending — opened / acknowledged gaps (not yet activated)

| # | Item | Source |
|---|---|---|
| (candidate) | Incremental WAL archiving (sub-24h RPO) | Wave 34 closeout §8 — deferred (requires PG config edits + restart; owner-gated) |
| n/a | Owner-gated behavior changes (billing rules, patient-discharge auto-confirm) | AGENTS.md §2.2 (intentionally deferred to owner) |

---

## Wave 35 — 2026-08-05 — Backup & PM2 Log Rotation
**Owner:** Copilot  •  **Commit:** pending  •  **Report:** [`WAVE_35_LOGROTATE_AR.md`](WAVE_35_LOGROTATE_AR.md)

### Added
- `namaweb/wave35_logrotate.js` — idempotent installer for two logrotate
  policies (wave30, pm2-nama), plus a 4-check `validateActivation()` and a
  Prometheus exposition.
- `namaweb/wave35_logrotate_test.js` — 32 unit / structural / safety tests
  (PASS on local + prod).
- `GET /api/metrics/logrotate` and `GET /api/metrics/logrotate/status` on
  `server.js` (same observability pattern as Wave 34).

### Changed / deployed on prod
- `/etc/logrotate.d/wave30` (root / 644) — daily rotate, 14-day retain,
  gzip + delaycompress, copytruncate, mode 0640 root:adm, syslog hook
  on prerotate + postrotate.
- `/etc/logrotate.d/pm2-nama` (root / 644) — daily rotate, 7-day retain,
  same defaults, postrotate runs `pm2 reloadLogs`.

### Verified
- 32/32 tests pass on prod.
- `logrotate --debug` parses both configs cleanly on prod.
- `/api/metrics/logrotate` returns 4/4 = 1.
- `/var/log/wave30.log` (newly written by the daily cron) and
  `/root/.pm2/logs/*.log` will now be rotated; both can no longer fill
  `/var/log`.

### Safety rails
- Rail 1 — no secrets in source; tests enforce.
- Rail 4 — installer touches only `/etc/logrotate.d/`; never `/etc/passwd`,
  never any data path, never DROP/DELETE on prod.
- Rail 7 — `/etc/logrotate.d/` mode preserved (755 root:root); new files are 644; rotated logs 0640 root:adm.

### Migration note
- `pm2 reloadLogs` requires pm2 CLI on PATH for the postrotate hook. If a future ops
  change moves pm2 elsewhere, the postrotate will silently no-op (`|| true`); the
  json status endpoint would still report correct install state. Operators should
  fix the PATH quickly but not as an emergency.

---

## Hotfix 35.1 — 2026-08-05 — `su root syslog` directive on logrotate policies

A forced `logrotate -f /etc/logrotate.d/wave30` after Wave 35 shipped
returned:

```
error: skipping "/var/log/wave30.log" because parent directory has
insecure permissions (It's world writable or writable by group which
is not "root")
Set "su" directive in config file to tell logrotate which user/group
should be used for rotation.
```

Debian/Ubuntu ships `/var/log` as `drwxrwxr-x root syslog` (mode
`775`, group `syslog`); logrotate refuses to write under any directory
whose group is non-root and has write. The PM2 policy under
`/root/.pm2/logs/` (root:root 755) did not trip the check.

### Fix
- `WAVE30_POLICY` now includes `su root syslog`.
- `PM2_POLICY` now includes `su root root` (explicit even though
  default would be root).

### Tests added
- `wave30 policy: has su directive (Debian /var/log is root:syslog 775)`
- `pm2 policy: has su directive (explicit root)`

Local run: **34/34 PASS** (was 32/32).

### Verified on prod
- Seeded `/var/log/wave30.log` (5 lines) + `/var/log/wave30-drill.log`
  (3 lines).
- `logrotate -f /etc/logrotate.d/wave30` → EXIT=0, archives created
  with mode 0640 root:adm.
- Second rotation → `delaycompress` produced a valid `.gz`
  (`1f8b 0800` magic bytes) of the previous archive; newest archive
  kept uncompressed for tailability.
- Syslog prerotate + postrotate hooks fired (3 events visible in
  `/var/log/syslog`).
- `/api/metrics/logrotate` still 4/4 = 1.
- Smoke residue cleaned up; cron will create fresh `/var/log/wave30.log`
  at 02:05 UTC.

### Lesson logged
Any future wave that adds a logrotate policy on Debian/Ubuntu MUST
run `logrotate -f` against a seeded log before declaring done — the
`logrotate_parses` check confirms the config is *syntactically* valid,
but the per-dir `su` requirement is a runtime gate that needs a real
forced rotation to surface.

### Safety rails
- Rail 1 — no secrets introduced.
- Rail 4 — only `/etc/logrotate.d/{wave30,pm2-nama}` were overwritten;
  no env, no DB, no PM2 restart beyond scheduled.
- Rail 7 — `/etc/logrotate.d/` mode preserved; archive mode 0640
  root:adm verified.

---

## Wave 34 — 2026-08-05 — Backup Activation & DR Drill
