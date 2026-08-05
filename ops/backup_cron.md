# NamaMedical ERP — Automated Backup Guide

**Server:** `204.168.144.74` · **Working dir:** `/var/www/namaweb/` · **DB:** `nama_medical_web` (PostgreSQL 14+)

This document describes how to install, verify, and recover from the
automated nightly backup system created by `ops/backup_db.sh`.

---

## 1. Files

| Path | Purpose |
|---|---|
| `/var/www/namaweb/ops/backup_db.sh` | Cron-driven dump + rotate + verify |
| `/var/www/namaweb/ops/backup_db_test.sh` | Round-trip integrity test (creates/drops throwaway DBs) |
| `/var/www/namaweb/backups/auto/db_*.sql.gz` | Backup files (30-day retention) |
| `/var/www/namaweb/backups/auto/db_LATEST.sql.gz` | Symlink to most recent backup |
| `/var/log/nama-backup.log` | Append-only run log |

The legacy Windows-only `/var/www/namaweb/backup.bat` is **not** modified
and is **not** used by this system. It remains as a historical artifact.

---

## 2. How it works

`backup_db.sh` performs, in order:

1. **Reads** `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` from
   `/var/www/namaweb/.env` (no hardcoded secrets).
2. **Dumps** the database with `pg_dump -Fc` (PostgreSQL custom format,
   already internally compressed).
3. **Extra-compresses** with `gzip -9` and writes to
   `backups/auto/db_<UTC-timestamp>.sql.gz`.
4. **Refreshes** the `db_LATEST.sql.gz` symlink atomically.
5. **Rotates** files older than 30 days (using `find -mtime +30 -delete`).
6. **Logs** every step (with UTC timestamp) to `/var/log/nama-backup.log`.

The script never touches production data: it only `SELECT`s via `pg_dump`
and writes new files in `backups/auto/`. The webroot never serves this
directory (it is outside the Express static path).

---

## 3. Install

The script lives at `/var/www/namaweb/ops/backup_db.sh` and is already
executable on the server. To re-install after a fresh deploy:

```bash
# from local workstation
scp -i ~/.ssh/nama_medical_key \
    backup_db.sh backup_db_test.sh \
    root@204.168.144.74:/var/www/namaweb/ops/

# on the server
ssh -i ~/.ssh/nama_medical_key root@204.168.144.74
chmod +x /var/www/namaweb/ops/backup_db.sh \
         /var/www/namaweb/ops/backup_db_test.sh
```

Sanity-check syntax and execution:

```bash
bash -n /var/www/namaweb/ops/backup_db.sh && echo "BASH SYNTAX OK"
/var/www/namaweb/ops/backup_db.sh            # creates first backup
/var/www/namaweb/ops/backup_db.sh --verify   # confirms integrity
/var/www/namaweb/ops/backup_db_test.sh       # full round-trip test
```

---

## 4. Cron schedule (KSA time)

The owner/operator installs the crontab entry — this script **does not**
modify the crontab automatically. To schedule nightly backups at **02:00
Asia/Riyadh** (= 23:00 UTC during winter; 23:00 UTC during summer since
KSA does **not** observe DST, so 02:00 KSA = 23:00 UTC year-round), use
the server's local clock which is set to `Asia/Riyadh`.

Install with:

```bash
crontab -e
```

Append this single line:

```cron
0 2 * * * /var/www/namaweb/ops/backup_db.sh >> /var/log/nama-backup.log 2>&1
```

Verify the install:

```bash
crontab -l | grep backup_db
# expected output: 0 2 * * * /var/www/namaweb/ops/backup_db.sh >> /var/log/nama-backup.log 2>&1
```

> **Note:** KSA is UTC+3 year-round. The cron entry uses the server's
> local time; if the server is on UTC, the equivalent UTC entry is
> `0 23 * * *`. Confirm with `date` and `timedatectl` before installing.

---

## 5. Verify an existing backup

```bash
/var/www/namaweb/ops/backup_db.sh --verify
# reads db_LATEST.sql.gz, runs pg_restore --list, prints TOC entry count
```

Round-trip test (creates + restores throwaway DBs):

```bash
/var/www/namaweb/ops/backup_db_test.sh
# exit 0 = rows match, exit 1 = mismatch or restore error
```

---

## 6. Recovery

To restore the **most recent** backup into the live database:

```bash
# STOP the app first to avoid live writes
pm2 stop nama-medical-erp

# Restore
gunzip -c /var/www/namaweb/backups/auto/db_LATEST.sql.gz \
    | pg_restore -U nama_medical_app -d nama_medical_web \
                 --no-owner --no-privileges

# Restart
pm2 start nama-medical-erp
```

To restore an **older** backup, replace `db_LATEST.sql.gz` with the
specific filename, e.g.:

```bash
ls /var/www/namaweb/backups/auto/db_*.sql.gz | head
gunzip -c /var/www/namaweb/backups/auto/db_20260728T220000Z.sql.gz \
    | pg_restore -U nama_medical_app -d nama_medical_web \
                 --no-owner --no-privileges
```

**Pre-flight checklist before any restore:**

- [ ] PM2 is stopped (`pm2 stop nama-medical-erp`)
- [ ] A *second* backup of the current (broken) state exists in case
      rollback is needed
- [ ] You are running as `root` (or with `sudo`) and have the DB
      password in `/var/www/namaweb/.env`
- [ ] The target database name is exactly `nama_medical_web`

---

## 7. Operational notes

- **Backups are off-webroot.** `/var/www/namaweb/backups/` is not
  served by Express. Even if a backup file leaks, it is not reachable
  via HTTP.
- **Compression tier.** `pg_dump -Fc` already uses LZ-style compression;
  the extra `gzip -9` step trades a small CPU cost for ~5–10% smaller
  files. Both steps together give belt-and-suspenders safety: if
  `gunzip` ever fails, `pg_restore` can still read the file directly
  via `zcat | pg_restore`.
- **Retention is 30 days.** Adjust `RETENTION_DAYS` in
  `backup_db.sh` if you need a longer window; for 7-year regulatory
  retention (PDPL/CBAHI) export to off-site cold storage separately.
- **No PHI is encrypted at the file level.** The dumps contain patient
  data. `/var/www/namaweb/backups/` should have restrictive permissions
  (currently `0777` per existing legacy dumps; tighten with
  `chmod 0700 /var/www/namaweb/backups/auto` after install).
- **Cron is owner-installed only.** The script never edits crontab.

---

## 8. Quick reference

| Action | Command |
|---|---|
| Run backup now | `/var/www/namaweb/ops/backup_db.sh` |
| Verify last backup | `/var/www/namaweb/ops/backup_db.sh --verify` |
| Round-trip test | `/var/www/namaweb/ops/backup_db_test.sh` |
| List backups | `ls -lh /var/www/namaweb/backups/auto/db_*.sql.gz` |
| Tail log | `tail -n 50 /var/log/nama-backup.log` |
| Restore latest | `gunzip -c /var/www/namaweb/backups/auto/db_LATEST.sql.gz \| pg_restore -U nama_medical_app -d nama_medical_web` |
