-- SQL Up Migration Script for Surgery & Operating Rooms Module
-- نظام نما الطبي (NamaMedical) - بيئة Staging
-- يقوم هذا السكربت بتفعيل حماية سجلات المستأجرين (RLS) وفرضها على الجداول الستة المستهدفة.

-- 1. جدول العمليات الجراحية (surgeries)
ALTER TABLE surgeries ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgeries FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rls_surgeries_tenant_isolation ON surgeries;
CREATE POLICY rls_surgeries_tenant_isolation ON surgeries
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 2. جدول تقييمات ما قبل الجراحة (surgery_preop_assessments)
ALTER TABLE surgery_preop_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgery_preop_assessments FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rls_surgery_preop_assessments_tenant_isolation ON surgery_preop_assessments;
CREATE POLICY rls_surgery_preop_assessments_tenant_isolation ON surgery_preop_assessments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 3. جدول فحوصات ما قبل الجراحة (surgery_preop_tests)
ALTER TABLE surgery_preop_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgery_preop_tests FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rls_surgery_preop_tests_tenant_isolation ON surgery_preop_tests;
CREATE POLICY rls_surgery_preop_tests_tenant_isolation ON surgery_preop_tests
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 4. جدول سجلات التخدير (surgery_anesthesia_records)
ALTER TABLE surgery_anesthesia_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgery_anesthesia_records FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rls_surgery_anesthesia_records_tenant_isolation ON surgery_anesthesia_records;
CREATE POLICY rls_surgery_anesthesia_records_tenant_isolation ON surgery_anesthesia_records
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 5. جدول غرف العمليات (operating_rooms)
ALTER TABLE operating_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE operating_rooms FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rls_operating_rooms_tenant_isolation ON operating_rooms;
CREATE POLICY rls_operating_rooms_tenant_isolation ON operating_rooms
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 6. جدول الموافقات الطبية (consent_forms)
ALTER TABLE consent_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_forms FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS rls_consent_forms_tenant_isolation ON consent_forms;
CREATE POLICY rls_consent_forms_tenant_isolation ON consent_forms
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
