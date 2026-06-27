-- ============================================================================
-- P0 Tenant Isolation — Modern Modules — VALIDATE (read-only)
-- يتحقق من نجاح التطبيق دون تعديل أي بيانات.
-- ============================================================================

-- 1) تأكيد وجود عمود tenant_id لكل جدول من الموجة 1
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND column_name = 'tenant_id'
  AND table_name IN (
      'medical_records_files','medical_records_requests','medical_records_coding',
      'clinical_pharmacy_reviews','patient_drug_education',
      'rehab_patients','rehab_sessions','rehab_goals','rehab_assessments',
      'portal_users','diet_orders','diet_meals','nutrition_assessments')
ORDER BY table_name;
-- المتوقع: 13 صفاً.

-- 2) تأكيد عدم وجود صفوف بـ tenant_id NULL (نجاح الـ backfill)
SELECT 'medical_records_files' AS t, COUNT(*) AS null_tenant FROM medical_records_files WHERE tenant_id IS NULL
UNION ALL SELECT 'clinical_pharmacy_reviews', COUNT(*) FROM clinical_pharmacy_reviews WHERE tenant_id IS NULL
UNION ALL SELECT 'rehab_patients', COUNT(*) FROM rehab_patients WHERE tenant_id IS NULL
UNION ALL SELECT 'portal_users', COUNT(*) FROM portal_users WHERE tenant_id IS NULL
UNION ALL SELECT 'diet_orders', COUNT(*) FROM diet_orders WHERE tenant_id IS NULL
UNION ALL SELECT 'nutrition_assessments', COUNT(*) FROM nutrition_assessments WHERE tenant_id IS NULL;
-- المتوقع: null_tenant = 0 للجميع.

-- 3) تأكيد تفعيل RLS + FORCE RLS
SELECT relname, relrowsecurity AS rls_enabled, relforcerowsecurity AS rls_forced
FROM pg_class
WHERE relname IN (
    'medical_records_files','medical_records_requests','medical_records_coding',
    'clinical_pharmacy_reviews','patient_drug_education',
    'rehab_patients','rehab_sessions','rehab_goals','rehab_assessments',
    'portal_users','diet_orders','diet_meals','nutrition_assessments')
ORDER BY relname;
-- المتوقع: rls_enabled = t و rls_forced = t للجميع.

-- 4) تأكيد وجود السياسات
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND policyname LIKE 'rls_%_tenant_isolation'
ORDER BY tablename;
-- المتوقع: 13 سياسة.

-- 5) تأكيد الفهارس
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public' AND indexname LIKE 'idx_%_tenant'
  AND tablename IN (
      'medical_records_files','clinical_pharmacy_reviews','rehab_patients',
      'portal_users','diet_orders','nutrition_assessments')
ORDER BY indexname;
