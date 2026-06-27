# Wave 1 — النسخ الاحتياطي المحلي المجدول

> 2026-06-22 | نسخ محلي مجدول مُتحقَّق. لا أسرار في الملفات/git. offsite/تشفير لاحقاً مع KMS.

## الحقول
```text
BACKUP_SCRIPT: ops/backups/nama_local_backup.ps1 (pg_dump -Fc؛ بلا كلمة مرور مضمّنة؛ يعتمد PGPASSFILE/PGPASSWORD من المشغّل)
BACKUP_DESTINATION: C:\Users\ice\nama_deploy_backups\scheduled\ (خارج المستودع)
RETENTION_POLICY: الاحتفاظ بآخر 14 نسخة يومية (حذف الأقدم تلقائياً)
SCHEDULE_CREATED: YES — Scheduled Task "NamaMedical-Local-Backup" يومي 02:00 (State=Ready)
VALIDATION_RESULT: PASS — نسخة تجريبية 708KB، pg_restore -l = 489 مدخل أرشيف (سليم)
RESTORE_DRY_RUN: pg_restore -l نجح (قائمة الأرشيف)؛ استعادة كاملة على قاعدة معزولة موصى بها دورياً
SECRETS_PRINTED: NO
FILES_OUTSIDE_REPO: YES (النسخ في nama_deploy_backups، خارج git)
RISK: منخفض (محلي إضافي)؛ الفجوة المتبقية: offsite + تشفير (يحتاج KMS)
ROLLBACK: حذف Scheduled Task + السكربت؛ لا أثر على الإنتاج
```

## ملاحظة المصادقة (مهمّة)
السكربت **لا يضمّن كلمة مرور**. للتشغيل غير المراقب (المهمة المجدولة) يجب أن يوفّر المشغّل المصادقة بأمان عبر **pgpass.conf** في ملف تعريف المستخدم (الآلية القياسية، خارج git) أو PGPASSWORD في بيئة المهمة. التحقّق لمرة واحدة استخدم اعتماد admin في الجلسة فقط (لم يُكتب/يُلتزَم). **حتى يوفّر المشغّل pgpass، ستفشل التشغيلات غير المراقبة (تُسجَّل FAIL بلا خطر بيانات).**

## التتابع المستقبلي
offsite + تشفير النسخ (gpg/openssl بمفتاح KMS — script candidate في PHASE_A3) عند توفّر KMS.
