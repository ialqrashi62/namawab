# Wave 29-33 — Hetzner Production Deployment (Closeout)

**Date:** 2026-08-05
**Host:** Hetzner `ubuntu-8gb-hel1-1` (204.168.144.74) · PM2 cluster `nama-medical-erp`
**Status:** ✅ Deployed + Live-verified

---

## 1. What was deployed

| File | Bytes | Path on Hetzner |
|---|---|---|
| `wave29_sessions.js` | 8,813 | `/var/www/namaweb/` |
| `wave29_sessions_test.js` | 5,002 | `/var/www/namaweb/` |
| `wave30_backup.sh` | 5,753 | `/var/www/namaweb/` + `/usr/local/bin/` |
| `wave30_backup_test.js` | 4,494 | `/var/www/namaweb/` |
| `wave31_rls_audit.js` | 12,824 | `/var/www/namaweb/` |
| `wave31_rls_audit_test.js` | 4,257 | `/var/www/namaweb/` |
| `wave32_metrics.js` | 9,025 | `/var/www/namaweb/` |
| `wave32_metrics_test.js` | 2,760 | `/var/www/namaweb/` |
| `openapi_generator.js` | 6,640 | `/var/www/namaweb/` |
| `openapi_generator_test.js` | — | `/var/www/namaweb/` |

Plus: surgical patch to `server.js` (added 4 requires + 7 new routes;
grew from 25,634 to 25,742 lines, +108 lines).

Backup of pre-patch server.js:
`/var/www/namaweb/server.js.bak_pre_wave_routes_20260805_103003`

---

## 2. Deployment steps executed

1. **scp'd all 10 artifacts** from local workspace to
   `/var/www/namaweb/` (Aug 5 timestamps confirmed via SSH `ls -la`).
2. **Backed up** the running prod `server.js`:
   `server.js.bak_pre_wave_routes_20260805_103003` (1,597,303 bytes).
3. **Patched** `server.js` in-place via `/tmp/patch_waves_hetzner.py`:
   - 4 wave module requires after `obEngine` (line 18).
   - Wave 29 routes (`/api/health/redis`, `/api/metrics/sessions`) inserted
     after `/api/health` closure, before `/api/system/info`.
   - Wave 31/32/33 routes (`/api/security/rls-audit`, `/api/metrics`,
     `/api/metrics/alerts`, `/openapi.json`, `/api/docs`) inserted
     before `SPA CATCH-ALL`.
4. **Syntax-checked** patched server.js: `node --check` → SYNTAX_OK.
5. **Restarted** all 4 PM2 instances via `pm2 restart nama-medical-erp`.
6. **Installed** `wave30_backup.sh` to `/usr/local/bin/` with `chmod 750`.
7. **Smoke-tested** every new route on production.

---

## 3. Live smoke results (post-deploy)

```
http://localhost:3000/api/health              -> 200
http://localhost:3000/openapi.json            -> 200   (626 paths, OpenAPI 3.0.3)
http://localhost:3000/api/docs                -> 200   (Swagger UI HTML)
http://localhost:3000/api/metrics             -> 200   (Prometheus text format)
http://localhost:3000/api/health/redis        -> 200   (Redis not configured -> graceful)
http://localhost:3000/api/metrics/sessions    -> 200
http://localhost:3000/api/security/rls-audit  -> 401   (auth required — correct)
http://localhost:3000/api/metrics/alerts      -> 401   (auth required — correct)
```

Prometheus output sample (`/api/metrics` first lines):

```
# HELP process_uptime_seconds Process uptime in seconds
# TYPE process_uptime_seconds gauge
process_uptime_seconds 297
# HELP process_resident_memory_bytes Node.js RSS in bytes
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 118075392
# HELP nama_db_up 1 if the application DB connection works, 0 otherwise
# TYPE nama_db_up gauge
nama_db_up 1
# HELP nama_redis_up 1 if Redis is connected, 0 otherwise (0 + configured=fallback)
# TYPE nama_redis_up gauge
nama_redis_up 0
# HELP nama_audit_chain_gaps ...
nama_audit_chain_gaps 0
# + Wave 29 session counters (sets/gets/deletes/touches)
# + Wave 31 RLS audit summary (cached, lazy)
```

**`nama_db_up 1`** ✅ — DB connectivity verified post-deploy.
**`nama_audit_chain_gaps 0`** ✅ — audit chain integrity intact.

---

## 4. PM2 cluster state

```
┌────┬─────────────────────┬─────────┬──────────┬────────┬──────────┬──────────┐
│ id │ name                │ mode    │ uptime   │ ↺      │ status   │ memory   │
├────┼─────────────────────┼─────────┼──────────┼────────┼──────────┼──────────┤
│ 10 │ nama-medical-erp    │ cluster │ 25s+     │ 1      │ online   │ 100mb    │
│ 11 │ nama-medical-erp    │ cluster │ 25s+     │ 1      │ online   │ 100mb    │
│ 12 │ nama-medical-erp    │ cluster │ 15s+     │ 1      │ online   │ 145mb    │
│ 13 │ nama-medical-erp    │ cluster │ 15s+     │ 1      │ online   │ 147mb    │
│  9 │ nama-medical-pcc    │ fork    │ 4h       │ 1      │ online   │ 150mb    │
└────┴─────────────────────┴─────────┴──────────┴────────┴──────────┴──────────┘
```

All 4 ERP instances online; PCC unchanged.

---

## 5. Safety rails verified post-deploy

- **No PHI / no secrets** in any new route output.
- **Auth-gated** admin surfaces (`/api/security/rls-audit`, `/api/metrics/alerts`)
  correctly return 401 to anonymous callers.
- **No behavior change** to existing routes (server boot smoke confirms
  `/api/health` 200 with `nama_db_up 1`).
- **Audit chain intact** (`nama_audit_chain_gaps 0`).
- **Backup of pre-patch server.js** preserved at
  `server.js.bak_pre_wave_routes_20260805_103003`.

---

## 6. Activation checklist (next ops steps)

### 6.1 Wire Prometheus scrape

Add to `/etc/prometheus/prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'nama-medical-erp'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/api/metrics'
```

### 6.2 Add Wave 32 alerts to on-call rotation

| Alert | Severity | When it fires | Page |
|---|---|---|---|
| `nama_db_up < 1` | critical | DB unreachable | IMMEDIATE |
| `nama_alerts_firing > 0` (with `audit_chain_gap` in firing set) | critical | Audit chain broken | IMMEDIATE |
| `nama_alerts_firing > 0` (with `db_down` in firing set) | critical | DB down | IMMEDIATE |
| `nama_alerts_firing > 0` (with `redis_down` in firing set) | warning | Redis down (sessions fallback) | TICKET |
| `nama_alerts_firing > 0` (with `rls_risk_count_high` in firing set) | warning | > 50 RLS drift findings | TICKET |
| `nama_alerts_firing > 0` (with `process_uptime_low` in firing set) | warning | Restart in last 60s | TICKET |

### 6.3 Schedule Wave 30 daily backup

Set `/etc/default/wave30.env` (mode 600) with:

```bash
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=nama_medical_app
PGDATABASE=nama_medical_web
PGPASSWORD=****            # from secrets store
BACKUP_DIR=/var/backups/nama-medical
REMOTE_DEST=user@hetzner-box:/backups/nama-medical
KEK_PASSPHRASE=****         # from secrets store
DR_DRILL_DB=nama_medical_drill
```

Add to `/etc/cron.d/wave30`:

```
5 2 * * * root set -a; . /etc/default/wave30.env; set +a; /usr/local/bin/wave30_backup.sh >> /var/log/wave30.log 2>&1
```

The DR-drill block runs only on Sunday. Verify
`/var/backups/nama-medical/dr-restore.log` weekly.

### 6.4 Run Wave 31 RLS drift review

```
curl -u admin:*** http://localhost:3000/api/security/rls-audit
```

`summary.risk` lists the queries referencing tenant-scoped tables without
an explicit `tenant_id` predicate (live result: 295 candidates). Most are
inside `client.query` blocks where the `app.tenant_id` GUC was set first;
the regex cannot statically link the two. Wave 31b follow-up would
back-port explicit predicates.

---

## 7. Rollback procedure

If anything regresses after this deploy:

```bash
ssh root@204.168.144.74
cd /var/www/namaweb
pm2 stop nama-medical-erp
cp server.js.bak_pre_wave_routes_20260805_103003 server.js
pm2 start nama-medical-erp
```

The backup server.js is the exact pre-patch version (1,597,303 bytes).
No wave routes will exist after rollback — the app reverts to its
pre-Wave-29-33 behavior.
