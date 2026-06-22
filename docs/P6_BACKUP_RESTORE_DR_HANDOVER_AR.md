# PHASE 6 — تسليم النسخ/الاسترداد/التعافي (Backup/Restore/DR)

> 2026-06-22 | يُكمّل P9_BACKUP_RESTORE_ROLLBACK_DR_FINAL_AUDIT (لا تكرار).

## النسخ الاحتياطي
- schema + data dumps خارج المستودع لكل دفعة DDL (boot/route a-b-c/14-table/phi-class-a/**daily_close**).
- daily_close: `~/nama_deploy_backups/daily_close_20260622/` (before_snapshot.json + up/down.sql).

## سكربتات التراجع (docs/sql/*_down.sql)
- 14_table، route_level a/b/c، boot_time، beds، icu_nursing، catalog، audit_trail (policy/grant/view)، **daily_close**، tenant_id index — كلها لها down.sql.

## التراجع التشغيلي
- **كود**: `git -C namaweb checkout <prev> -- server.js && pm2 restart` (ae539b2↔bc24a47 قابل).
- **DB**: down.sql المناسب (بموافقة قبل أي تراجع DDL إنتاجي).
- **PM2**: dump.pm2 + resurrect.
- **Redis/Docker**: docker start nama-redis (unless-stopped؛ Docker autostart).

## التعافي بعد reboot
HKCU Run (logon resurrect) + watchdog كل 5د يُعيد Redis+PM2 تلقائياً. يدوياً: راجع P4 runbook.

## drill
- تمارين استعادة معزولة PASS (آخرها daily_close: up→isolation→down على قاعدة throwaway).
- موصى: `pg_restore -l` دوري على الـdumps (MEDICAL_BACKUP_RESTORE_DRILL).

```text
BACKUP_RESTORE_DR_HANDOVER: READY
```
