# تفعيل RLS + tenant backfill للجداول الـ14 المتبقية — إغلاق نهائي (مُنفَّذ)

> المرحلة: `APPROVE_FULL_REMAINING_RLS_DDL_AND_BACKFILL` | 2026-06-21 | DDL محدود + backfill tenant_id فقط، بموافقة صريحة. بلا code/GRANT/accounting/.env.

## ملخص
أُغلقت آخر فجوة RLS tenant-sensitive: الـ14 جدولاً (التي كانت بلا عزل DB) أصبحت **FORCE RLS + policy + tenant_id DEFAULT**. backfill `tenant_id=1` فقط لجدولين بصفوف (branches=1، employees=3) بقاعدة آمنة مُثبَتة. **FORCE_RLS 133→147.** الإنتاج لم يُعَد تشغيله (RLS يُفرَض على مستوى DB فوراً).

## التنفيذ
- **Gate 0-2**: preflight أخضر؛ SQL = النسخة المُجرَّبة (14 جدول، RLS-safe، backfill tenant_id فقط، لا seed/GRANT/DROP/DELETE — مؤكَّد)؛ backup حاضر (schema + data dumps + rowcounts)، الحالة قبلية مطابقة (FORCE=133، 14-tables بلا tenant_id).
- **Gate 3**: تنفيذ `14_table_rls_backfill_candidate_up.sql` (postgres، atomic) ⇒ OK.
- **Gate 4 validate**: 14/14 tenant_id+FORCE+policy+DEFAULT؛ branches rows=1 null=0 tenant1=1؛ employees rows=3 null=0 tenant1=3؛ role غير-super؛ **FORCE_RLS=147**. PASS.
- **Gate 5 RLS smoke**: health 5/5؛ /=200 /login=200 /api/patients(noauth)=401؛ binding patients ctx1=3/999=0/no-ctx=0؛ **العزل على الجداول المتأثرة: employees ctx1=3/ctx999=0، branches ctx1=1/ctx999=0**؛ لا 42501/42P01.
- **Gate 6/7**: accounting OFF، journal 0، audit-reader NO، GRANT NO، code NOT deployed، **PM2 NOT restarted**، سجلات نظيفة.

## الحقول
```text
FINAL_STATUS: PRODUCTION_DDL_AND_BACKFILL_PASS_FULL_REMAINING_RLS
SELECTED_PHASE: APPROVE_FULL_REMAINING_RLS_DDL_AND_BACKFILL
DB_ROLE_CURRENT: nama_medical_app
APP_ROLE_SUPERUSER: false
APP_ROLE_BYPASSRLS: false
APP_PATH_TENANT_BINDING: PASS
FORCE_RLS_BEFORE: 133
FORCE_RLS_AFTER: 147
TABLES_IN_SCOPE: 14
TABLES_FIXED: 14
TABLES_BACKFILLED: 2 (branches, employees)
BACKFILL_RULES: tenant_id=1 (المستأجر الوحيد ذو البيانات؛ tenant 2 فارغ تماماً؛ branches.facility_id=1)
ROWS_CHANGED_BY_TABLE: branches=1, employees=3 (إجمالي 4)
ROW_COUNTS_PRESERVED: YES (branches=1, employees=3 قبل/بعد)
BUSINESS_COLUMNS_UNCHANGED: YES (أُضيف/ضُبط tenant_id فقط)
RLS_ENABLED: YES (14)
FORCE_RLS_ENABLED: YES (14)
POLICIES_CREATED: 14 (rls_<t>_tenant_isolation)
TENANT_DEFAULTS_CREATED: 14
SQL_EXECUTED: YES_LIMITED_FULL_REMAINING_RLS
DATA_CHANGED: YES_LIMITED_TENANT_ID_BACKFILL_ONLY
GRANT_EXECUTED: NO
CODE_DEPLOYED: NO
PM2_RESTARTED: NO
HEALTH_SMOKE: PASS
RLS_SMOKE: PASS
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
AUDIT_READER_GRANTED_TO_APP: NO
BACKUP_CREATED: YES
ROLLBACK_READY: YES (14_table_rls_backfill_candidate_down.sql + schema/data dumps)
ROLLBACK_USED: NO
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: POST_DDL_MONITORING_THEN_PM2_WINDOWS_STARTUP_AND_API_RBAC
```

## الأثر
كل الجداول tenant-sensitive في `nama_medical_web` الآن محميّة بـFORCE RLS (147 جدول). لا فجوة RLS tenant-sensitive متبقية على مستوى DB. عزل المستأجرين مفروض على طبقتي DB + التطبيق.

تم اكتمال تفعيل RLS والـtenant backfill لكل الجداول المتبقية تحت الدور المحدود
