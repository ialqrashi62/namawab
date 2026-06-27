-- SQL Down Rollback Script for Surgery & Operating Rooms Module
-- نظام نما الطبي (NamaMedical) - بيئة Staging
-- يقوم هذا السكربت بإلغاء سياسات RLS وتعطيل الحماية لإرجاع الجداول لوضعها الأصلي.

-- 1. جدول العمليات الجراحية (surgeries)
DROP POLICY IF EXISTS rls_surgeries_tenant_isolation ON surgeries;
ALTER TABLE surgeries DISABLE ROW LEVEL SECURITY;
ALTER TABLE surgeries NO FORCE ROW LEVEL SECURITY;

-- 2. جدول تقييمات ما قبل الجراحة (surgery_preop_assessments)
DROP POLICY IF EXISTS rls_surgery_preop_assessments_tenant_isolation ON surgery_preop_assessments;
ALTER TABLE surgery_preop_assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE surgery_preop_assessments NO FORCE ROW LEVEL SECURITY;

-- 3. جدول فحوصات ما قبل الجراحة (surgery_preop_tests)
DROP POLICY IF EXISTS rls_surgery_preop_tests_tenant_isolation ON surgery_preop_tests;
ALTER TABLE surgery_preop_tests DISABLE ROW LEVEL SECURITY;
ALTER TABLE surgery_preop_tests NO FORCE ROW LEVEL SECURITY;

-- 4. جدول سجلات التخدير (surgery_anesthesia_records)
DROP POLICY IF EXISTS rls_surgery_anesthesia_records_tenant_isolation ON surgery_anesthesia_records;
ALTER TABLE surgery_anesthesia_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE surgery_anesthesia_records NO FORCE ROW LEVEL SECURITY;

-- 5. جدول غرف العمليات (operating_rooms)
DROP POLICY IF EXISTS rls_operating_rooms_tenant_isolation ON operating_rooms;
ALTER TABLE operating_rooms DISABLE ROW LEVEL SECURITY;
ALTER TABLE operating_rooms NO FORCE ROW LEVEL SECURITY;

-- 6. جدول الموافقات الطبية (consent_forms)
DROP POLICY IF EXISTS rls_consent_forms_tenant_isolation ON consent_forms;
ALTER TABLE consent_forms DISABLE ROW LEVEL SECURITY;
ALTER TABLE consent_forms NO FORCE ROW LEVEL SECURITY;
