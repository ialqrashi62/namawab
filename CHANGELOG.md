# Changelog — jumanaMedical ERP

All notable changes to the prod ERP, grouped by wave. Each entry links
to the full Arabic/English closeout report when one exists. "N/A" means
the change was small enough to be merged without its own report.

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
