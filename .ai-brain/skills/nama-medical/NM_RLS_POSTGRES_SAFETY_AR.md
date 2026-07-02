# NM_RLS_POSTGRES_SAFETY — سلامة PostgreSQL/RLS وعزل المستأجرين

## متى تُستخدم
أي بوابة تمس قاعدة البيانات، السكيما، الـ RLS، أو tenant isolation.

## الهدف
ضمان عزل كامل بين المستأجرين عبر PostgreSQL Row Level Security في نظام الطبيب متعدد المستأجرين.

## قواعد إلزامية
```
FORCE_RLS: YES — كل جدول يحتوي بيانات مستأجر يجب أن يحمل RLS مُفعَّل
TENANT_ID_REQUIRED: YES — كل صف يجب أن يحمل tenant_id
SET_APP_TENANT_ID: YES — يجب SET app.tenant_id = X قبل أي query
NON_SUPERUSER_APP_ROLE: YES — تطبيق الإنتاج لا يعمل بصلاحيات superuser
NO_BYPASSRLS: YES — ممنوع BYPASSRLS على دور التطبيق
READ_ONLY_PREFLIGHT: YES — افحص فقط في الـ preflight، لا تُعدِّل
MIGRATION_SAFETY: YES — جرِّب على staging أولاً
LOCK_RISK_CHECK: YES — راجع lock risk قبل أي DDL
ROLLBACK_PLAN: YES — لازم rollback plan مكتوب قبل أي تغيير
CROSS_TENANT_TEST: YES — اختبر أن مستأجراً لا يرى بيانات آخر
```

## خطوات التنفيذ
```sql
-- 1. تحقق من FORCE RLS على الجداول
SELECT tablename, rowsecurity, forcerowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND rowsecurity = true;

-- 2. تحقق من وجود policy لكل جدول
SELECT schemaname, tablename, policyname
FROM pg_policies WHERE schemaname = 'public';

-- 3. تحقق من دور التطبيق
SELECT rolname, rolsuper, rolbypassrls
FROM pg_roles WHERE rolname = 'nama_medical_app';
-- المتوقع: rolsuper=false, rolbypassrls=false

-- 4. اختبار cross-tenant denial
SET app.tenant_id = '1';
SELECT count(*) FROM patients; -- يجب إرجاع صفوف tenant 1 فقط
SET app.tenant_id = '2';
SELECT count(*) FROM patients; -- يجب إرجاع صفوف tenant 2 فقط فقط
```

## أدلة النجاح
- جميع الجداول ذات بيانات مستأجر تحمل `forcerowsecurity=true`
- دور التطبيق: `superuser=false, bypassrls=false`
- اختبار cross-tenant: PASS
- لا سجلات اختراق بين مستأجرين في الـ audit log

## حالات الحظر
- جدول بيانات مستأجر بدون RLS → BLOCKED_RLS_MISSING
- دور التطبيق superuser/bypassrls → BLOCKED_INSECURE_DB_ROLE
- cross-tenant leak اكتُشف → BLOCKED_CROSS_TENANT_LEAK
- بدون rollback plan → BLOCKED_NO_ROLLBACK_PLAN

## صيغة التقرير المختصر
```
RLS_GATE: PASS/BLOCKED
tables_checked: N | tables_with_rls: N | tables_missing_rls: N
app_role_superuser: NO | app_role_bypassrls: NO
cross_tenant_test: PASS/FAIL
production_touched: NO | DDL_executed: NO
```
