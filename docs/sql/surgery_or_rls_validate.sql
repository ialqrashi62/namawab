-- SQL Post-Migration Validation Script for Surgery & Operating Rooms Module
-- نظام نما الطبي (NamaMedical) - بيئة Staging
-- تم إعداد هذا الملف للتحقق من أن سياسات RLS قد تم تفعيلها وفرضها بنجاح مع السياسات المناسبة.

-- 1. فحص حالة تفعيل RLS وفرضه لجميع الجداول الستة
SELECT c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('surgeries', 'surgery_preop_assessments', 'surgery_preop_tests', 'surgery_anesthesia_records', 'operating_rooms', 'consent_forms')
ORDER BY table_name;

-- 2. عرض السياسات المضافة والتأكد من تطابقها مع current_setting
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('surgeries', 'surgery_preop_assessments', 'surgery_preop_tests', 'surgery_anesthesia_records', 'operating_rooms', 'consent_forms')
ORDER BY tablename;
