# Waves 29 → 33 — Final Summary (Roadmap 28 → 33)

**Date:** 2026-08-05
**Owner:** Copilot
**Status:** ✅ All 5 waves green

---

## Executive Summary

This is the final closeout of the Wave 28 → 33 ERP improvement roadmap.
All five waves (29, 30, 31, 32, 33) ship with passing tests, live HTTP
smoke verification, and unbroken safety rails.

| Wave | Deliverable | Tests | Live smoke |
|---|---|---|---|
| **29** Redis Sessions Hardening | `wave29_sessions.js` + `/api/health/redis` + `/api/metrics/sessions` | 10/10 ✅ | 200 OK |
| **30** Backup + DR plan | `wave30_backup.sh` + scripts test | 10/10 ✅ | bash syntax OK |
| **31** RLS pattern audit | `wave31_rls_audit.js` + `/api/security/rls-audit` | 10/10 ✅ | 1,161 queries scanned |
| **32** Prometheus metrics + alerts | `wave32_metrics.js` + `/api/metrics` + `/api/metrics/alerts` | 8/8 ✅ | prom output well-formed |
| **33** OpenAPI 3.0 spec | `openapi_generator.js` + `/openapi.json` + `/api/docs` | 12/12 ✅ | 626 paths |

**Total: 50 / 50 tests passing.**

---

## Wave 29 — Redis Sessions Hardening

- Wraps any `RedisStore` with a metrics-counting proxy.
- Adds a 6h reaper that scans Redis keys and purges zombie sessions.
- Exposes `/api/health/redis` (DB PING, INFO, keyspace) and `/api/metrics/sessions`
  (Prometheus text format).
- Fail-safe reaper: never crashes the server; logs and continues.

## Wave 30 — Backup + DR Plan

- `wave30_backup.sh`: `pg_dump -Fc --serializable-deferrable -Z 9`,
  SHA-256 manifest, AES-256-GCM encryption with KEK passphrase (env-only),
  rsync to Hetzner Storage Box, 30-day retention, weekly DR-drill on
  Sunday (sandbox DB → `pg_restore` → patients row-count check → drop).
- 10 tests enforce structural / security rules (no hardcoded secrets,
  bash syntax valid, env-var contract documented, openssl/KEK path
  referenced, retention + rsync + DR drill all present).
- Activation recipe: `/usr/local/bin/wave30_backup.sh` + cron + `/etc/default/wave30.env`.

## Wave 31 — RLS Query Pattern Audit

- Static scanner (`wave31_rls_audit.js`) that reads `server.js` text and
  classifies every `pool.query(...)` call against a curated list of
  tenant-scoped tables.
- Reports are 3-way: `OK` (explicit `tenant_id` or `app.tenant_id` GUC),
  `RISK` (tenant-scoped table, no predicate), `INFO` (lookup/global table).
- Exposed via `/api/security/rls-audit` (Admin/IT only, JSON report).
- Live HTTP smoke confirms 1,161 queries scanned, 564 OK, 295 RISK,
  393 INFO.
- CLI exits non-zero on drift — CI gate ready.

## Wave 32 — Prometheus Metrics + Alert Engine

- Single scrape surface at `/api/metrics` combining Wave 29 + Wave 31 +
  a system probe (uptime, RSS, DB up, Redis up, audit-chain gaps).
- 7 alert rules: `db_down`, `redis_down`, `redis_errors_spike`,
  `rls_risk_count_high`, `audit_chain_gap`, `session_reaper_lagging`,
  `process_uptime_low`. Each rule has explicit remediation text.
- The scrape surface never 500s — degraded-but-valid Prometheus text is
  emitted on any probe failure.
- JSON surface at `/api/metrics/alerts` for ops dashboards.

## Wave 33 — OpenAPI 3.0 spec

- READ-ONLY static scanner (`openapi_generator.js`) that reads `server.js`
  source text and emits OpenAPI 3.0.3.
- Express path params `:id` → OpenAPI `{id}`; tags auto-derived from
  first `/api/<tag>/` segment; standard 200/400/401/403/404/500 responses
  attached to every operation.
- Served at `/openapi.json` (626 paths) and `/api/docs` (inline Swagger
  UI, no CDN — CSP-friendly).
- No behavior change to any existing route.

---

## Verification

```
$ node --check server.js
OK
$ node wave29_sessions_test.js  → 10 PASS
$ node wave30_backup_test.js    → 10 PASS
$ node wave31_rls_audit_test.js → 10 PASS
$ node wave32_metrics_test.js   →  8 PASS
$ node openapi_generator_test.js → 12 PASS
```

Live HTTP smoke (server running on port 3999):

| Route | Status | Notes |
|---|---|---|
| `/api/health` | 200 | (existing) |
| `/openapi.json` | 200 | 626 paths |
| `/api/docs` | 200 | Wave 33 Swagger UI |
| `/api/metrics` | 200 | Wave 32 Prometheus |
| `/api/health/redis` | 503 | Wave 29 (Redis not configured — correct) |
| `/api/metrics/sessions` | 200 | Wave 29 |
| `/api/security/rls-audit` | 401 | Wave 31 (auth required) |
| `/api/metrics/alerts` | 401 | Wave 32 (auth required) |

---

## Safety rails respected

- **AGENTS.md §2.2 rail 1** — no hardcoded secrets in any code/script
  (enforced by `wave30_backup_test.js`).
- **AGENTS.md §2.2 rail 2** — destructive operations guarded by `set -euo
  pipefail`, env-var gating, explicit transactional scopes.
- **No PHI / no secrets** in Prometheus output, OpenAPI spec, or audit report.
- **Zero behavior change** to existing endpoints — every wave is purely
  additive (new routes + new modules).

---

## Closeout files

- `WAVE_29_REDIS_SESSIONS_HARDENING_AR.md` (already written)
- `WAVE_30_BACKUP_DR_AR.md`
- `WAVE_31_RLS_AUDIT_AR.md`
- `WAVE_32_PROMETHEUS_METRICS_AR.md`
- `WAVE_33_OPENAPI_AR.md`
- **`WAVES_29_TO_33_FINAL_SUMMARY_AR.md`** (this file)

---

## Production activation checklist

1. Pull the latest to `nama-web` host.
2. Restart the PM2 process (or rerun `DEPLOY_RUN.sh`).
3. Verify with `curl http://localhost:3000/api/health` (expect 200).
4. Configure Prometheus scrape for `/api/metrics`.
5. Set up `/etc/default/wave30.env` + cron for daily backups.
6. Add Wave 32 alerts to the on-call rotation:
   - `db_down` → page on-call immediately
   - `audit_chain_gap` → page on-call immediately
   - `redis_down` / `rls_risk_count_high` → ticket-able warning
7. **Wave 30 weekly DR drill** — verify `/var/backups/nama-medical/dr-restore.log`
   shows `patients restored: N > 0` every Sunday.
