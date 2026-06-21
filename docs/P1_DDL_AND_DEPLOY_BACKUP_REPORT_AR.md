# P1 — تقرير النسخ الاحتياطي قبل DDL/النشر (Backup Report)

> المرحلة: `P1_INVOICE_SCHEMA_DRIFT_DDL_AND_ACCUMULATED_SECURITY_DEPLOY` — البوابة 1 | التاريخ: 2026-06-21.

```text
DB_BACKUP_PATH: (محلي خارج المستودع) nama_deploy_backups/invoices_backup.json — تصدير invoices (15 عموداً + 3 صفوف، قبل DDL)
SERVER_JS_BACKUP_PATH: (محلي خارج المستودع) nama_deploy_backups/server.js.pre-082c07b-deploy-8f012a0.bak (7422 سطر = الكود الحيّ السابق 8f012a0)
BACKUP_VERIFIED: YES (الملفان مكتوبان؛ invoices_backup يحوي cols=15/rows=3)
ROLLBACK_READY: YES
SECRETS_PRINTED: NO
```

## مسارات التراجع الموثّقة
- **الكود**: استعادة `server.js` من backup (8f012a0) أو `git -C namaweb checkout 8f012a0 -- server.js` + `pm2 restart`.
- **DDL**: `docs/sql/invoice_schema_drift_candidate_down.sql` (DROP COLUMN IF EXISTS للعشرة) — آمن لأن الأعمدة أُضيفت بهذه الترقية؛ يُفضّل backup restore إن عُبّئت لاحقاً.
- **بيانات**: لا تغيير بيانات (DDL additive فقط)؛ invoices_backup.json كاحتياط للصفوف الثلاثة.

`DDL_AND_DEPLOY_BACKUP_REPORT_COMPLETE`
