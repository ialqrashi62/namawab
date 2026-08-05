# NamaMedical ERP — Ops Automation Installation

> **Scope:** wires the four ops scripts to `cron` and documents the
> restore / enforce flows. This file lives at `/var/www/namaweb/ops/INSTALL.md`
> on the production server (Hetzner `ubuntu-8gb-hel1-1` · 204.168.144.74).
>
> **Read first:** [`AGENTS.md`](../../AGENTS.md) §2.2 — the 12 safety rails.
> In particular, rail 4 (no destructive ops without owner authorization) and
> rail 8 (CSP enforce is owner-authorized) apply to several flows here.

---

## 1. Scripts in this directory

| File | Purpose | Trigger |
|---|---|---|
| `backup_db_auto.sh`        | Nightly PostgreSQL dump → gzip → 30-day rotation | cron daily 02:00 UTC |
| `db_health_check.sh`       | Daily DB diagnostic report (tables, RLS, disk, slow queries) | cron daily 03:00 UTC |
| `audit_log_query.sh`       | Read-only audit/event log inspector | on-demand (ad-hoc) |
| `csp_enforce_ready.sh`     | Dry-run: are there any CSP violations? | on-demand, before `CSP_ENFORCE=true` |
| `safety_audit.sh`          | Pre-flight static checks (already present) | on-demand, before any deploy |

> **Pre-flight helper:** before any deploy or config change, run
> `bash /var/www/namaweb/ops/safety_audit.sh` to catch obvious mistakes
> (hardcoded secrets, missing `.env`, broken CSP headers, etc.).

---

## 2. Cron installation (manual, owner-authorized)

> ⚠️ **AGENTS.md §2.2 rail 4 / §2.4** — cron changes are owner-authorized.
> The install steps below are documented; **do not** run them without
> explicit approval.

### 2.1 Open the crontab

```bash
sudo crontab -e
```

### 2.2 Add the two lines below

```cron
# NamaMedical ops automation — AGENTS.md §6
0  2 * * *  /var/www/namaweb/ops/backup_db_auto.sh        >> /var/log/namaweb/backup.log  2>&1
0  3 * * *  /var/www/namaweb/ops/db_health_check.sh       >> /var/log/namaweb/db_health.log 2>&1
```

| Field | Meaning |
|---|---|
| `0 2 * * *` | At **02:00 UTC** every day (run via `date -u` — server clock is UTC) |
| `0 3 * * *` | At **03:00 UTC** every day (one hour after backup) |
| `>>` | Append (never clobber) |
| `/var/log/namaweb/*.log` | Per-cron-job log file (separate from the script's own log) |

### 2.3 Verify

```bash
sudo crontab -l | grep namaweb
```

You should see both lines. If the crontab was empty before, the first edit
will create one at `/var/spool/cron/crontabs/root`.

### 2.4 Uninstall

```bash
sudo crontab -l | grep -v 'namaweb/ops/' | sudo crontab -
```

---

## 3. Logs

| File | Owner | Rotation |
|---|---|---|
| `/var/log/namaweb/backup.log`           | `backup_db_auto.sh`   | grows ~10 KB/day; manual rotation |
| `/var/log/namaweb/db_health_YYYY-MM-DD.log` | `db_health_check.sh`  | one file per day, keep 30d |
| `/var/log/namaweb/csp_preflight_*.log`  | `csp_enforce_ready.sh`| keep last 10 |
| `/var/log/nama-medical-erp-out.log`     | PM2 (`nama-medical-erp`) | PM2 logrotate (`pm2 logrotate`) |
| `/var/log/nama-medical-erp-error.log`   | PM2 (`nama-medical-erp`) | PM2 logrotate |

> **PM2 log rotation** is configured at the application level; this
> directory does not need an external `logrotate` rule.

---

## 4. Restoring from a backup

> ⚠️ **AGENTS.md §2.2 rail 4** — database restore is destructive.
> Always snapshot the current DB first (`pg_dump` again), confirm with
> the owner, and run during the lowest-traffic window.

```bash
# 0. List available backups
ls -lht /var/www/namaweb/backups/auto/db_*.sql.gz | head -10
ls -lht /var/www/namaweb/backups/auto/db_LATEST.sql.gz

# 1. Snapshot the current DB before touching anything
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74 \
  "pg_dump -h localhost -U nama_medical_app -d nama_medical_web -Fc \
   --no-owner --no-privileges \
   | gzip -9 > /tmp/pre_restore_$(date -u +%Y%m%dT%H%M%SZ).sql.gz"

# 2. Drop & recreate the target DB (owner-only)
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74 \
  "sudo -u postgres psql -c 'DROP DATABASE nama_medical_web;' && \
   sudo -u postgres psql -c 'CREATE DATABASE nama_medical_web OWNER nama_medical_app;'"

# 3. Restore
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74 \
  "gunzip -c /var/www/namaweb/backups/auto/db_LATEST.sql.gz | \
   pg_restore -h localhost -U nama_medical_app -d nama_medical_web \
     --no-owner --no-privileges --role=nama_medical_app"

# 4. Verify row counts on the top 5 tables
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74 \
  "PGPASSWORD=\$(grep ^DB_PASSWORD= /var/www/namaweb/.env | cut -d= -f2) \
   psql -U nama_medical_app -d nama_medical_web -h 127.0.0.1 -tAc \
   \"SELECT relname, n_live_tup FROM pg_stat_user_tables
     ORDER BY n_live_tup DESC LIMIT 5;\""
```

> If the restore fails on a particular object (e.g. an extension that was
> present on the source but not the target), inspect the .sql.gz with
> `pg_restore --list` and re-run with `--no-acl --no-owner` plus the
> offending object excluded.

---

## 5. CSP enforce pre-flight

> ⚠️ **AGENTS.md §2.2 rail 8** — flipping `CSP_ENFORCE=true` is
> owner-authorized. Always run `csp_enforce_ready.sh` first.

### 5.1 Run the dry-run

```bash
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74 \
  "bash /var/www/namaweb/ops/csp_enforce_ready.sh --days 7"
```

### 5.2 Read the verdict

* **Exit 0** — *SAFE TO ENFORCE.* No violations in the last 7 days.
  You may proceed.
* **Exit 1** — *UNSAFE.* At least one directive has violations.
  Read the `Top breaking URLs` block, fix the offending resources, then
  re-run the script.
* **Exit 2** — *cannot read PM2 logs.* Check the script's hints and verify
  the log path (the script tries `/var/log/<app>-out.log`, then
  `/root/.pm2/logs/<app>-out.log`).

### 5.3 When safe, enable enforcement

> Do **not** edit `.env` directly. Use the dedicated toggle script:
> [`toggle_csp_enforce.sh`](./toggle_csp_enforce.sh) (owner-authorized,
> requires `OPS_BYOK=1` in env).

```bash
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74 \
  "OPS_BYOK=1 bash /var/www/namaweb/ops/toggle_csp_enforce.sh enable"
```

Then restart the app:

```bash
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74 "pm2 restart nama-medical-erp"
```

---

## 6. Quick recipes

### Run a one-off DB health check now

```bash
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74 \
  "bash /var/www/namaweb/ops/db_health_check.sh"
```

### Run a one-off backup now (and verify)

```bash
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74 \
  "bash /var/www/namaweb/ops/backup_db_auto.sh && \
   bash /var/www/namaweb/ops/backup_db_auto.sh --verify 2>/dev/null; \
   bash /var/www/namaweb/ops/backup_db.sh --verify"
```

> Note: `backup_db.sh` (the older file) is the verify-only entry point;
> `backup_db_auto.sh` always verifies inline, so `--verify` is not needed
> for the new file.

### Inspect the last 24 h of audit events

```bash
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74 \
  "bash /var/www/namaweb/ops/audit_log_query.sh last_24h"
```

### Filter audit by tenant + action

```bash
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74 \
  "bash /var/www/namaweb/ops/audit_log_query.sh last_7d \
        --tenant t_001 --action invoice"
```

### JSONL output → jq

```bash
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74 \
  "bash /var/www/namaweb/ops/audit_log_query.sh last_7d --jsonl \
   | jq -c 'select(.action | test(\"payment|invoice\"))'"
```

---

## 7. Token-saver / pre-flight cross-references

Before any of the above, run:

```bash
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74 \
  "bash /var/www/namaweb/ops/safety_audit.sh"
```

If that exits non-zero, **stop** — fix the underlying issue before
running the operational scripts. Common failures:

| `safety_audit.sh` failure | Fix |
|---|---|
| Missing `.env`               | Restore from backup, or re-create from `.env.example` |
| Hardcoded secret in `server.js` | Use `process.env.XXX`; reload |
| CSP header missing           | Check `helmet` config in `server.js` |
| RLS off on a tracked table   | Re-apply the latest `*_rls_*.sql` migration |

---

## 8. Out-of-scope (do not automate)

Per AGENTS.md §8, these flows require explicit owner approval each time:

* Editing `namaweb/server.js` middleware
* Editing `namaweb/db_postgres.js` schema
* Running `pm2 restart` on the live app
* Flipping `CSP_ENFORCE` to `true`
* Running `pg_restore` (database restore)
* Editing this `INSTALL.md` or `AGENTS.md`

If a future request asks the agent to "just install the cron" or
"just enable CSP", refer the requester to this file and the owner
approval flow documented in `AGENTS.md §2.4`.
