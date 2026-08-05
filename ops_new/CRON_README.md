# NamaMedical ERP — ops/ Cron Schedule

This document describes the three cron jobs installed by
[`ops/cron_install.sh`](./cron_install.sh) on the production host
(`204.168.144.74`, Ubuntu 22.04).

The cron file lives at `/etc/cron.d/namaweb-ops` (system-wide cron, not
the user crontab). It is the single source of truth for the schedule —
re-running the installer is safe and produces an identical file.

---

## 1. The three jobs (all times UTC)

| Time (UTC) | Frequency    | Script                                     | Log                                              |
|------------|--------------|--------------------------------------------|--------------------------------------------------|
| 02:00      | daily        | `/var/www/namaweb/ops/backup_db_auto.sh`   | `/var/log/namaweb-backup.log`                    |
| 03:00      | daily        | `/var/www/namaweb/ops/db_health_check.sh`  | `/var/log/namaweb-db-health.log`                 |
| 04:00      | Sunday only  | `/var/www/namaweb/ops/safety_audit.sh`     | `/var/log/namaweb-safety.log`                    |

### 1.1 Daily DB backup — 02:00 UTC
`backup_db_auto.sh` runs `pg_dump -Fc` against the `nama_medical`
database, gzip-compresses the output, writes a timestamped file under
`/var/backups/namaweb/`, refreshes the `db_LATEST.sql.gz` symlink, and
rotates files older than `BACKUP_RETENTION_DAYS` (default `30`).
Idempotent and safe to re-run manually.

### 1.2 Daily DB health check — 03:00 UTC
`db_health_check.sh` runs a read-only diagnostic sweep: connection,
table count, RLS coverage, migration drift, disk usage, long-running
queries, connection saturation. Never mutates DB state.

### 1.3 Weekly safety audit — 04:00 UTC (Sunday)
`safety_audit.sh` performs the weekly security/quality scan.
See [`./safety_audit.sh`](./safety_audit.sh) for the full checklist.

---

## 2. Install

```bash
sudo bash /var/www/namaweb/ops/cron_install.sh
```

The installer is **idempotent** — running it again is a no-op for
existing artifacts and a re-write for the cron file (its content is
deterministic).

After install, you MUST edit the real database password (one-time, manual):

```bash
sudoedit /etc/namaweb-backup.env
# replace: PGPASSWORD=__CHANGE_ME__
```

> The password is **never** embedded in any script or the crontab. Each
> cron job sources `/etc/namaweb-backup.env` (`chmod 600`, `root:root`)
> at runtime.

---

## 3. Verify

```bash
# 1. Cron file exists with the right owner/mode
ls -la /etc/cron.d/namaweb-ops

# 2. Cron file content
cat /etc/cron.d/namaweb-ops

# 3. Env file exists, is mode 600, owned by root
ls -la /etc/namaweb-backup.env

# 4. Backup dir exists
ls -la /var/backups/namaweb

# 5. Active cron jobs (system cron reads /etc/cron.d/* at the top of each minute)
systemctl status cron
```

A user-level `crontab -l` should remain empty — all jobs are in
`/etc/cron.d/namaweb-ops`.

---

## 4. Manual trigger

To run a job by hand (does not affect the schedule):

```bash
# Backup (loads env, then runs the script)
sudo bash -c 'set -a; . /etc/namaweb-backup.env; set +a; \
              /var/www/namaweb/ops/backup_db_auto.sh'

# Health check
sudo bash -c 'set -a; . /etc/namaweb-backup.env; set +a; \
              /var/www/namaweb/ops/db_health_check.sh'

# Safety audit
sudo bash -c 'set -a; . /etc/namaweb-backup.env; set +a; \
              /var/www/namaweb/ops/safety_audit.sh'
```

---

## 5. Read logs

```bash
# Live tail (Ctrl-C to exit)
sudo tail -f /var/log/namaweb-backup.log

# Last 200 lines of today's health check
sudo tail -n 200 /var/log/namaweb-db-health.log

# Installer's own log
sudo cat /var/log/namaweb-cron-install.log
```

Cron emails the `MAILTO=ops@jumanasoft.com` recipient on any non-zero
exit; in practice, `/var/log/namaweb-*.log` is the primary signal.

---

## 6. Disable

To stop all three jobs without uninstalling anything else:

```bash
sudo rm /etc/cron.d/namaweb-ops
sudo systemctl reload cron   # or: sudo service cron reload
```

To re-enable, just re-run the installer (see §2).

---

## 7. Files in this folder

| Path                                       | Purpose                                                                 |
|--------------------------------------------|-------------------------------------------------------------------------|
| `cron_install.sh`                          | Idempotent installer (this is what you run)                             |
| `namaweb-backup.env.example`               | Reference template for `/etc/namaweb-backup.env`                        |
| `CRON_README.md`                           | This document                                                           |
| `backup_db_auto.sh`                        | The script invoked at 02:00 UTC                                         |
| `db_health_check.sh`                       | The script invoked at 03:00 UTC                                         |
| `safety_audit.sh`                          | The script invoked at 04:00 UTC Sundays (see file for the full audit)   |
| `audit_log_query.sh`                       | Read-only audit query tool (no cron — invoke by hand)                   |
| `csp_enforce_ready.sh`                     | Pre-flight check for CSP enforcement (manual run only)                  |
| `INSTALL.md`                               | General install notes for the ops/ folder                               |

---

## 8. Token-saver

This README is intentionally short and reference-style. The detailed
behavior of each script is documented inside the script itself
(comments at the top). To learn what the weekly safety audit actually
checks, open [`./safety_audit.sh`](./safety_audit.sh) — do not duplicate
its content here.
