-- ============================================================================
-- P0 Tenant Isolation — Modern Modules — NO-OP SAFETY CHECKS (read-only)
-- تُشغَّل قبل up.sql للتأكد من سلامة البيئة. لا تعدّل أي شيء.
-- ============================================================================

-- 1) المستأجر الافتراضي موجود (شرط نجاح backfill إلى tenant_id=1)
SELECT id, name FROM tenants WHERE id = 1;
-- المتوقع: صف واحد. إن كان فارغاً، أوقف — لا تطبّق up.sql.

-- 2) عدد المستأجرين الحالي (تأكيد البيئة single-tenant قبل backfill آمن)
SELECT COUNT(*) AS tenant_count FROM tenants;
-- إن كان > 1، راجع backfill يدوياً (قد لا يكون كل الصفوف للمستأجر 1).

-- 3) حصر الجداول المستهدفة الموجودة فعلاً (تفادي أخطاء على جدول مفقود)
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
      'medical_records_files','medical_records_requests','medical_records_coding',
      'clinical_pharmacy_reviews','patient_drug_education',
      'rehab_patients','rehab_sessions','rehab_goals','rehab_assessments',
      'portal_users','diet_orders','diet_meals','nutrition_assessments')
ORDER BY table_name;

-- 4) تأكيد أن مستخدم التطبيق ليس superuser ولا يتجاوز RLS (وإلا RLS بلا أثر)
SELECT rolname, rolsuper, rolbypassrls
FROM pg_roles
WHERE rolname = 'nama_medical_app';
-- المتوقع: rolsuper = f و rolbypassrls = f.

-- 5) لقطة أعداد الصفوف قبل التطبيق (للمقارنة بعد backfill — لا يتغير العدد)
SELECT 'rehab_patients' AS t, COUNT(*) FROM rehab_patients
UNION ALL SELECT 'portal_users', COUNT(*) FROM portal_users
UNION ALL SELECT 'diet_orders', COUNT(*) FROM diet_orders;
