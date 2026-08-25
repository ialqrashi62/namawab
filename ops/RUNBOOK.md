# NamaMedical ERP — Operations Runbook

> **Single source of truth for daily ops.** Owner: SRE · Audience: on-call + ops
> · Last regenerated: 2026-07-29 · Cross-link: `AGENTS.md` §2 (rails) ·
> `ops/INSTALL.md` (first-deploy) · `ops/CRON_README.md` (cron detail)

## 1. TL;DR

| Need | One-liner |
|---|---|
| **Server** | Hetzner `ubuntu-8gb-hel1-1` · `204.168.144.74` · `jumanasoft.com` |
| **SSH key** | `C:\Users\ice\.ssh\nama_medical_key` (Windows) → `/root/.ssh/...` (server) |
| **App root** | `/var/www/namaweb/` (main) · `/var/www/namaweb-pcc/` (PCC) |
| **PM2 apps** | `nama-medical-erp` (main :3000) · `nama-medical-pcc` (PCC :3001) |
| **DB role** | `nama_medical_app` (non-superuser) — see `ops/INSTALL.md` |
| **Backups** | nightly `02:00` to `/var/backups/namaweb/` (retention 30 d) |
| **CSP** | report-only by default; enforce = owner-authorized deploy |
| **Audit log** | inert by default; `AUDIT_ALL_MUTATIONS=true` enables GATE3-M1 |
| **Run all tests** | `bash /var/www/namaweb/ops/run_all_tests.sh` (when present) |
| **Help** | any script with `--help` prints usage; all are idempotent & read-only by default |

```powershell
# Operator quick-connect (Windows)
$env:NAMA_SSH = "C:\Users\ice\.ssh\nama_medical_key"
ssh -i $env:NAMA_SSH root@204.168.144.74
```

---

## 2. Quick Reference

> 16 ops tools. **On disk = ✅** · **Planned (not yet on server) = ⏳**.
> All scripts accept `--help`. All shell scripts are idempotent + read-only by
> default. All Node tools require Node 20+ and `pg` lib (already in `package.json`).

| # | Tool | Path | Purpose | Exit | Status |
|---|---|---|---|---|---|
| 1 | `backup_db_auto.sh` | `ops/backup_db_auto.sh` | Nightly `pg_dump` + gzip + retention | `0` ok / `1` fail | ✅ |
| 2 | `db_health_check.sh` | `ops/db_health_check.sh` | DB connectivity, RLS, bloat, locks | `0` ok / `1` fail / `2` warn | ✅ |
| 3 | `audit_log_query.sh` | `ops/audit_log_query.sh` | Read-only query of `audit_trail` | `0` ok / `2` bad args | ✅ |
| 4 | `csp_enforce_ready.sh` | `ops/csp_enforce_ready.sh` | Pre-flight: safe to flip CSP enforce? | `0` safe / `1` unsafe / `2` no logs | ✅ |
| 5 | `cron_install.sh` | `ops/cron_install.sh` | Idempotent cron + env-file installer | `0` installed / `1` missing env | ✅ |
| 6 | `smoke_test.sh` | `ops/smoke_test.sh` | 25+ endpoint HTTP checks (green/yellow/red) | `0` pass / `1` fail / `2` warn | ✅ |
| 7 | `audit_toggle.sh` | `ops/audit_toggle.sh` | Enable/disable `AUDIT_ALL_MUTATIONS` safely | `0` toggled / `1` blocked | ⏳ |
| 8 | `run_all_tests.sh` | `ops/run_all_tests.sh` | Run all `*_test.js` + e2e in one shot | `0` all pass / `1` some fail | ⏳ |
| 9 | `db_query.js` | `tools/db_query.js` | Ad-hoc SQL (SELECT only by default) | `0` rows / `1` error | ✅ |
| 10 | `pcc_benchmark.js` | `tools/pcc_benchmark.js` | Throughput / p50/p95 for PCC fns | `0` ok / `1` slow | ✅ |
| 11 | `health_probe.js` | `tools/health_probe.js` | Per-endpoint latency + status check | `0` ok / `1` red | ✅ |
| 12 | `sample_data_generator.js` | `pcc/tools/sample_data_generator.js` | Build dummy inputs for any PCC fn | `0` ok | ✅ |
| 13 | `audit_export.js` | `tools/audit_export.js` | Export `audit_trail` → NDJSON/CSV | `0` ok / `1` error | ✅ |
| 14 | `secrets_audit.js` | `tools/secrets_audit.js` | Scan tracked files for hardcoded secrets | `0` clean / `1` finding | ⏳ |
| 15 | `csp_enforce_audit.js` | `tools/csp_enforce_audit.js` | Audit CSP report lines + directive gaps | `0` ok / `1` unsafe | ⏳ |
| 16 | e2e tests (4 files) | `tests/e2e_*.test.js`, `pcc/tests/e2e_*.test.js` | Playwright e2e: `e2e_pcc_catalog.test.js`, `e2e_pcc_module_lifecycle.test.js`, `e2e_public_pages.test.js`, `e2e_static_assets.test.js` | `0` pass / `1` fail | ✅ |

> **Exit-code legend** — All ops tools follow this convention:
> `0` green · `1` red (must fix) · `2` yellow (warning, did not fail) · `3+` reserved.

---

## 3. Daily Operations

### 3.1 What runs at 02:00 / 03:00 / 04:00 Sunday

Cron file: `/etc/cron.d/namaweb-ops` (system-wide, NOT user crontab).
Installed by `cron_install.sh`. Reload with `service cron reload` after edits.

| Time | Cron expr | Job | Script | Log |
|---|---|---|---|---|
| **02:00 daily** | `0 2 * * *` | DB backup (`pg_dump` + gzip + 30 d retention) | `ops/backup_db_auto.sh` | `/var/log/namaweb-backup.log` |
| **03:00 Sunday** | `0 3 * * 0` | DB health report (weekly) | `ops/db_health_check.sh` | `/var/log/namaweb-db-health.log` |
| **04:00 Sunday** | `0 4 * * 0` | CSP pre-flight (was the report-only state safe?) | `ops/csp_enforce_ready.sh` | `/var/log/namaweb/csp_preflight_*.log` |

> See `ops/CRON_README.md` for full cron detail and `ops/INSTALL.md` for
> first-time install. Backup detail: `ops/backup_cron.md`.

### 3.2 How to read logs

| Log | Where | Tailable? | When to read |
|---|---|---|---|
| Backup | `/var/log/namaweb-backup.log` | yes | if `02:05` alert fires |
| DB health | `/var/log/namaweb-db-health.log` | yes | weekly review (Sunday AM) |
| CSP preflight | `/var/log/namaweb/csp_preflight_*.log` | dated files | before any CSP enforce deploy |
| PM2 main | `pm2 logs nama-medical-erp --lines 200` | yes | any app incident |
| PM2 PCC | `pm2 logs nama-medical-pcc --lines 200` | yes | any PCC incident |
| nginx | `/var/log/nginx/access.log` + `error.log` | yes | any 5xx |
| Systemd | `journalctl -u nama-medical-erp -n 200` | yes | if PM2 is unavailable |

```bash
# Quick health read
ssh -i $NAMA_SSH root@204.168.144.74 \
  "tail -50 /var/log/namaweb-backup.log; echo '---'; pm2 logs nama-medical-erp --lines 50 --nostream --raw"
```

### 3.3 How to verify cron is working

| Check | Command | Pass criterion |
|---|---|---|
| Cron file exists | `ls -la /etc/cron.d/namaweb-ops` | file present, perms `644` |
| Cron service running | `service cron status` | `active (running)` |
| Env file present | `ls -la /etc/namaweb-backup.env` | perms `600`, owner `root` |
| Last backup timestamp | `ls -lt /var/backups/namaweb/*.sql.gz \| head -1` | <24 h old |
| Cron daemon reloaded | `grep -c namaweb-ops /var/log/syslog` | ≥1 entry after install |

---

## 4. On-Demand Operations

> Every command below is **read-only / idempotent** unless marked 🔒 (owner-only).

### 4.1 "I want to check the DB is healthy"

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "bash /var/www/namaweb/ops/db_health_check.sh"
```
*What this does:* connectivity test, version check, RLS sanity, bloat top-5, lock summary. *When to use:* weekly, after any schema migration, before any deploy.

### 4.2 "I want to query a table"

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "node /var/www/namaweb/tools/db_query.js --query='SELECT count(*) FROM audit_trail'"
ssh -i $NAMA_SSH root@204.168.144.74 "node /var/www/namaweb/tools/db_query.js --query='SELECT 1' --readonly=false"
```
*What this does:* runs SQL via `pg` pool, tabulates output, refuses mutations unless `--readonly=false`. *When to use:* ad-hoc investigation. Never paste real PHI in shell history.

### 4.3 "I want to test the API"

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "bash /var/www/namaweb/ops/smoke_test.sh"
```
*What this does:* 25+ HTTP assertions against `/`, `/api/health`, `/api/public/plans`, `/openapi-pcc.yaml`, etc. Green ✓, yellow ⚠, red ✗. *When to use:* after every deploy, before any maintenance window close.

### 4.4 "I want to benchmark"

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "node /var/www/namaweb/tools/pcc_benchmark.js --module=pcc_cardiology_ext50 --fn=RiskScore --iter=200"
```
*What this does:* runs the named PCC function N times, reports p50/p95/p99 + mean. *When to use:* before promoting a new engine, after any engine rewrite.

### 4.5 "I want to generate sample data for a PCC function"

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "node /var/www/namaweb-pcc/tools/sample_data_generator.js pcc_cardiology_ext50 RiskScore"
```
*What this does:* emits a JSON of plausible dummy inputs for the named `(module, fn)` pair; **never** real PHI. *When to use:* test fixture authoring, repro cases in sandboxes.

### 4.6 "I want to audit secrets"

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "node /var/www/namaweb/tools/secrets_audit.js"        # ⏳ planned
```
*What this does:* scans tracked JS/JSON/env files for `sk-…`, `Bearer eyJ…`, `BEGIN PRIVATE KEY`, etc. Fails closed. *When to use:* before every PR merge, weekly cron candidate.

### 4.7 "I want to query the audit log"

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "bash /var/www/namaweb/ops/audit_log_query.sh --action=DELETE --since=24h"
```
*What this does:* filters `audit_trail` by action / module / user / time. *When to use:* incident triage, compliance evidence pack.

### 4.8 "I want to export audit log to NDJSON"

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "node /var/www/namaweb/tools/audit_export.js --format=ndjson --since=7d > /tmp/audit_week.ndjson"
```
*What this does:* streams rows to stdout; safe to redirect. *When to use:* evidence pack, external SIEM ingest.

### 4.9 "I want a per-endpoint health probe"

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "node /var/www/namaweb/tools/health_probe.js --targets=/healthz,/api/public/plans,/openapi-pcc.yaml"
```
*What this does:* measures latency, classifies green (<500ms) / yellow (<2s) / red (>2s or 5xx). *When to use:* before status-page refresh.

---

## 5. Incident Response

> All commands assume `$NAMA_SSH=C:\Users\ice\.ssh\nama_medical_key`.
> Cross-ref: `AGENTS.md` §2.2 (13 safety rails) + `docs/PHASE_*_AR.md` (remediation history).

### 5.1 DB connection failed

| Symptom | Diagnose | Fix |
|---|---|---|
| 500s in PM2 with `ECONNREFUSED 127.0.0.1:5432` | `systemctl status postgresql` | `systemctl start postgresql` |
| `password authentication failed` | `cat /etc/namaweb-backup.env` (perms 600) | re-source env, `psql -U $PGUSER -h $PGHOST -c '\conninfo'` |
| Pool exhaustion | `bash ops/db_health_check.sh` → "active connections" | lower app pool, restart PM2 |
| Disk full on `/var` | `df -h` | see §5.4 |

### 5.2 PCC server down

| Symptom | Diagnose | Fix |
|---|---|---|
| `pm2 list` shows `errored` for `nama-medical-pcc` | `pm2 logs nama-medical-pcc --lines 200` | `pm2 restart nama-medical-pcc` (🔒) |
| PCC routes 502 | `curl -sI http://127.0.0.1:3001/healthz` | check `pcc/server.js` syntax: `node -c pcc/server.js` |
| PCC module missing | `ls /var/www/namaweb-pcc/pcc/ \| grep pcc_<name>` | re-sync from `/var/www/namaweb/pcc/` or rebuild |

### 5.3 nginx 502 / 504

| Symptom | Diagnose | Fix |
|---|---|---|
| 502 Bad Gateway | `tail -50 /var/log/nginx/error.log` | upstream app down → §5.1 or §5.2 |
| 504 Gateway Timeout | `pm2 list` (any app wedged?) | `pm2 reload <app>` (🔒) |
| TLS error | `nginx -t` | fix config, `systemctl reload nginx` |

### 5.4 Disk full

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "
  df -h | head -10
  echo '---'
  du -sh /var/log/* 2>/dev/null | sort -h | tail -10
  echo '---'
  du -sh /var/backups/namaweb/* 2>/dev/null | sort -h | tail -5
"
```
*Action:* (a) rotate logs via `logrotate -f /etc/logrotate.d/namaweb`; (b) verify
backup retention in `ops/backup_db_auto.sh` (`BACKUP_RETENTION_DAYS=30`); (c)
never delete DB rows — see `AGENTS.md` §2.2 rail 4.

---

## 6. Owner-Authorized Changes (🔒)

> Anything below requires explicit owner approval. Default to **ask first**.

### 6.1 PM2 reload (no downtime)

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "pm2 reload nama-medical-erp"   # zero-downtime
ssh -i $NAMA_SSH root@204.168.144.74 "pm2 reload nama-medical-pcc"
```
**Cautions:** never `pm2 kill` (drops both apps); never `pm2 delete` then `start`
during business hours — use `reload`. Verify with `pm2 list` (status `online`).

### 6.2 Audit log toggle (GATE3-M1)

**Plan:** `ops/audit_toggle.sh` (⏳ planned). Manual sequence until shipped:

```bash
# 1. Verify inert default
ssh -i $NAMA_SSH root@204.168.144.74 "grep AUDIT_ALL_MUTATIONS /var/www/namaweb/.env || echo 'INERT'"
# 2. Enable (after staging dry-run ≥ 24 h)
ssh -i $NAMA_SSH root@204.168.144.74 "sed -i 's/^AUDIT_ALL_MUTATIONS=.*/AUDIT_ALL_MUTATIONS=true/' /var/www/namaweb/.env"
ssh -i $NAMA_SSH root@204.168.144.74 "pm2 reload nama-medical-erp"
# 3. Verify by checking audit_middleware.js wiring + a sample row
ssh -i $NAMA_SSH root@204.168.144.74 "bash ops/audit_log_query.sh --action=UPDATE --since=1h"
```
**Cautions:** AGENTS.md §2.2 rail 10 (audit hash-chain); never disable once on.
Disable = `AUDIT_ALL_MUTATIONS=false` + `pm2 reload`.

### 6.3 CSP enforce activation

**Pre-flight (always run first):**

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "bash /var/www/namaweb/ops/csp_enforce_ready.sh --days 7"
# Expect: "SAFE TO ENFORCE" + exit 0
```

**Activation (only if pre-flight = 0):**

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "
  sed -i 's/^CSP_ENFORCE=.*/CSP_ENFORCE=true/' /var/www/namaweb/.env
  pm2 reload nama-medical-erp
"
```
**Cautions:** AGENTS.md §2.2 rail 8; never flip during a deploy; have the
`ops/csp_enforce_ready.sh` report attached to the change request.

### 6.4 Cron install (re-run idempotent)

```bash
ssh -i $NAMA_SSH root@204.168.144.74 "bash /var/www/namaweb/ops/cron_install.sh"
```
**What it does:** writes `/etc/cron.d/namaweb-ops` + `/etc/namaweb-backup.env`
only if missing (`P4 install_if_missing` pattern). **Cautions:** env file perms
must stay `600`; never commit the real env — only `*.env.example`.

---

## 7. Reference Index

### 7.1 All file paths

| Layer | Path | Notes |
|---|---|---|
| App root (main) | `/var/www/namaweb/` | Express + SPA + migrations + tests |
| App root (PCC) | `/var/www/namaweb-pcc/` | PCC engine + 100+ modules |
| Ops scripts | `/var/www/namaweb/ops/` | 8 shell scripts + 2 markdown |
| Ops tools (Node) | `/var/www/namaweb/tools/` | 6 Node CLIs (incl. ⏳ planned) |
| PCC tools | `/var/www/namaweb-pcc/tools/` | sample data generator + sandboxes |
| Tests (main) | `/var/www/namaweb/tests/` | e2e + unit |
| Tests (PCC) | `/var/www/namaweb-pcc/tests/` | e2e PCC lifecycle |
| Env (live) | `/etc/namaweb-backup.env` | perms 600, owner root |
| Env (template) | `/var/www/namaweb/ops/namaweb-backup.env.example` | placeholders only |
| Cron | `/etc/cron.d/namaweb-ops` | system-wide, perms 644 |
| Backups | `/var/backups/namaweb/*.sql.gz` | 30 d retention |
| Public status | `/var/www/namaweb/public/status/` | uptime dashboard (3 files) |
| API docs | `/var/www/namaweb/public/api-docs/index.html` | self-contained viewer |
| OpenAPI | `/var/www/namaweb/public/openapi-pcc.yaml` | served via nginx allowlist |

### 7.2 Environment variables

> Source of truth: `ops/namaweb-backup.env.example`. **No real values in this
> file.** The runtime app reads from `/var/www/namaweb/.env` (app) and
> `/etc/namaweb-backup.env` (cron/ops). Safety rail 1 forbids hardcoded values.

| Var | Used by | Purpose |
|---|---|---|
| `PGHOST` | backup, health, db_query, audit | Postgres host |
| `PGPORT` | same | Postgres port (default 5432) |
| `PGUSER` | same | role (e.g. `nama_medical_app`) |
| `PGPASSWORD` | same | **never in tracked files** |
| `PGDATABASE` | same | DB name |
| `BACKUP_DIR` | backup_db_auto.sh | where dumps land |
| `BACKUP_RETENTION_DAYS` | backup_db_auto.sh | default `30` |
| `AUDIT_ALL_MUTATIONS` | audit_middleware.js, audit_toggle | `true`/`false`, default `false` |
| `CSP_ENFORCE` | server.js, csp_enforce_ready | `true`/`false`, default `false` |
| `PM2_APP` | csp_enforce_ready, smoke_test | PM2 app name |
| `LOOKBACK_DAYS` | csp_enforce_ready, audit_log_query | default `7` / `24h` |
| `SUPER_ADMIN_USERS` | server.js (super-admin RBAC) | comma-separated |
| `NODE_ENV` | server.js, all tools | `production` skips DB auto-init |

### 7.3 All log file paths

| Log | Path | Writer | Rotation |
|---|---|---|---|
| Backup | `/var/log/namaweb-backup.log` | cron → `backup_db_auto.sh` | `logrotate` weekly |
| DB health | `/var/log/namaweb-db-health.log` | cron → `db_health_check.sh` | weekly |
| CSP preflight | `/var/log/namaweb/csp_preflight_*.log` | `csp_enforce_ready.sh` | dated, keep 30 |
| PM2 main | `~/.pm2/logs/nama-medical-erp-*.log` | PM2 | PM2 default |
| PM2 PCC | `~/.pm2/logs/nama-medical-pcc-*.log` | PM2 | PM2 default |
| nginx | `/var/log/nginx/{access,error}.log` | nginx | `logrotate` daily |
| Systemd | `journalctl -u nama-medical-erp` | systemd | journald default |

### 7.4 Exit codes (all ops tools)

| Code | Meaning | Operator action |
|---|---|---|
| `0` | All green / safe to proceed | continue |
| `1` | Red — at least one hard fail | investigate before continuing |
| `2` | Yellow — warnings only | review, but not blocking |
| `3+` | Reserved (script-specific) | check that tool's `--help` |

### 7.5 Cross-references

| Topic | Doc |
|---|---|
| 13 safety rails | `AGENTS.md` §2.2 |
| First-time install | `ops/INSTALL.md` |
| Cron detail | `ops/CRON_README.md` + `ops/backup_cron.md` |
| PCC catalog | `PCC_CATALOG_README.md` |
| Public status | `public/status/index.html` |
| Phase history | `docs/PHASE_*_AR.md` |
| GATE history | `docs/GATE*_AR.md` |
| Live deploy | `ops/live_deploy/DEPLOY_NOTES.md` |
| Engineering constitution | `docs/governance/enterprise-engineering-constitution/` |

---

## 8. Changelog of this file

| Date | Change | Author |
|---|---|---|
| 2026-07-29 | Initial creation: 16-tool reference, 7 sections, 60%+ table density, cross-links to `INSTALL.md` / `CRON_README.md` | Mavis (ops docs) |
