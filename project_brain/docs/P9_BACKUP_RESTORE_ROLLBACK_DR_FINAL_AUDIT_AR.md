# PHASE 9 — النسخ الاحتياطي/الاسترداد/التراجع/التعافي من الكوارث

> 2026-06-22 | تحقّق read-only.

## النسخ الاحتياطي
- schema + data dumps خارج المستودع لكل دفعة DDL (boot/route a-b-c/14-table/phi-class-a).

## سكربتات التراجع (موجودة في docs/sql/)
- 14_table، route_level a/b/c، boot_time، beds، icu_nursing، catalog، audit_trail (policy/grant/view)، **daily_close** (مُرهَّن)، **tenant_id index** — كلها لها down.sql.
- **PM2 rollback**: `git -C namaweb checkout <prev> -- server.js && pm2 restart` (مُستخدَم سابقاً؛ ae539b2↔bc24a47 قابل للتراجع).
- **DB rollback**: down.sql لكل دفعة (تُسقط RLS/policy/tenant_id بأمان).

## التعافي التشغيلي (مُثبَت حيّ)
- PM2 logon resurrect (HKCU Run) + watchdog كل 5 دقائق (يسجّل OK؛ يُعيد nama-redis+pm2 عند السقوط).
- nama-redis unless-stopped؛ Docker autostart؛ incident runbook موجود (`PM2_WINDOWS_STARTUP_AND_HEALTH_WATCHDOG_RUNBOOK_AR.md`).

## drill
- تمارين استعادة على قواعد معزولة PASS (incl. daily_close rehearsal هذه الجلسة: up→isolation proof→down).

## الحالة
```text
BACKUP_ROLLBACK_STATUS: READY (per-batch down.sql + external dumps + PM2/DB rollback + autorecovery)
RESTORE_DRILL: PASS (isolated)   INCIDENT_RUNBOOK: present
```
