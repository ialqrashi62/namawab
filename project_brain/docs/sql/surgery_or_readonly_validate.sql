-- SQL Read-Only Validation Queries for Surgery & Operating Rooms Module
-- نظام نما الطبي (NamaMedical) - بيئة Staging
-- تم إعداد هذا الملف للتحقق الاستكشافي للقراءة فقط من بنية الجداول وتفعيل RLS دون إجراء أي تغييرات.

-- 1. التحقق من وجود أعمدة العزل والنوع لكل جدول في قاعدة البيانات
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name IN ('surgeries', 'surgery_preop_assessments', 'surgery_preop_tests', 'surgery_anesthesia_records', 'operating_rooms', 'consent_forms')
  AND column_name IN ('tenant_id', 'facility_id', 'branch_id')
ORDER BY table_name, column_name;

-- 2. التحقق من وجود أي قيم فارغة NULL لمعرّفات العزل في غرف العمليات القائمة
SELECT COUNT(*) AS total_rooms,
       COUNT(CASE WHEN tenant_id IS NULL THEN 1 END) AS null_tenant_count,
       COUNT(CASE WHEN branch_id IS NULL THEN 1 END) AS null_branch_count
FROM operating_rooms;

-- 3. فحص حالة تفعيل RLS الفعلي لجدول العمليات وغرف العمليات من خلال pg_class
SELECT c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('surgeries', 'surgery_preop_assessments', 'surgery_preop_tests', 'surgery_anesthesia_records', 'operating_rooms', 'consent_forms')
ORDER BY table_name;

-- 4. الاستعلام عن أي سياسات حماية نشطة للجداول المعنية في pg_policies
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('surgeries', 'surgery_preop_assessments', 'surgery_preop_tests', 'surgery_anesthesia_records', 'operating_rooms', 'consent_forms')
ORDER BY tablename;
