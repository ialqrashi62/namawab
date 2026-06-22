# التحقّق من النسخ المحلي المجدول غير المراقب (pgpass)

> 2026-06-22 | أُغلقت نقطة التشغيل: المهمة المجدولة تنسخ unattended عبر pgpass، بلا كلمة مرور في السكربت أو git. لا تغيير إنتاجي على التطبيق.

## ما تمّ
- `pgpass.conf` كان غائباً ⇒ أُنشئ في الموقع القياسي `%APPDATA%\postgresql\pgpass.conf` (خارج المستودع، خارج السكربت)، بصلاحية مقيّدة للمستخدم (icacls inheritance:r + grant للمستخدم فقط). **محتواه لم يُطبع إطلاقاً.**
- شُغّلت مهمة `NamaMedical-Local-Backup` يدوياً (Start-ScheduledTask) ⇒ نجحت **بلا كلمة مرور في السكربت** (اعتمدت pgpass) ⇒ أنشأت `nama_20260622_093231.dump` (707KB).
- `backup.log`: "OK backup ... 707KB".
- تحقّق السلامة: `pg_restore -l` = 1851 مدخل أرشيف (نسخة صالحة، بلا اتصال DB).

## الحقول
```text
FINAL_STATUS: BACKUP_UNATTENDED_SCHEDULE_VERIFIED
PGPASS_EXISTS: YES (أُنشئ هذه الجلسة في %APPDATA%\postgresql\pgpass.conf)
PGPASS_CONTENT_PRINTED: NO
SCHEDULED_TASK_EXISTS: YES (NamaMedical-Local-Backup، يومي 02:00، Ready)
MANUAL_TASK_RUN: YES (Start-ScheduledTask نجح)
BACKUP_CREATED: YES (nama_20260622_093231.dump، 707KB)
BACKUP_PATH: C:\Users\ice\nama_deploy_backups\scheduled\ (خارج repo)
PG_RESTORE_VALIDATE: PASS (1851 مدخل أرشيف)
SECRETS_PRINTED: NO
GIT_CHANGED: DOCS_ONLY
PRODUCTION_CHANGES: NONE (لا تغيير على التطبيق؛ pgpass + نسخة محلية فقط)
DDL_EXECUTED: NO
DATA_CHANGED: NO
GRANT_EXECUTED: NO
CODE_DEPLOYED: NO
PM2_RESTARTED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
NEXT_RECOMMENDED_ACTION: PROVIDE_TEST_ACCOUNT_FOR_BROWSER_E2E
```

## ملاحظات أمنية
- pgpass.conf في موقع libpq القياسي (ملف تعريف المستخدم)، **ليس في git ولا في السكربت ولا في .env**؛ ACL مقيّد للمستخدم. السكربت `ops/backups/nama_local_backup.ps1` خالٍ من أي كلمة مرور (يعتمد PGPASSFILE/pgpass).
- النسخ تبقى خارج المستودع؛ الاحتفاظ آخر 14 يومياً.
- المتبقّي للتصلّب الكامل: **offsite + تشفير النسخ** (يحتاج KMS — script candidate في PHASE_A3)، واستعادة كاملة دورية على قاعدة معزولة (drill).

تم التحقق من النسخ المحلي المجدول غير المراقب دون كشف أسرار أو تغيير إنتاجي
