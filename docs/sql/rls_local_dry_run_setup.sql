-- ============================================================================
-- سكربت تهيئة التشغيل التجريبي المحلي لـ RLS (RLS Local Dry-Run Setup)
-- المشروع: نظام نما الطبي (NamaMedical)
-- الملف: docs/sql/rls_local_dry_run_setup.sql
-- التحذير: للاستخدام المحلي/التجريبي فقط! (LOCAL/TEST ENVIRONMENT ONLY)
-- يمنع تماماً تشغيله على خوادم أو قواعد الإنتاج.
-- ============================================================================

\echo '========================================================'
\echo '  تحذير أمني: تشغيل تهيئة RLS تجريبياً على قاعدة البيانات المحلية'
\echo '========================================================'

-- 1. صمام الأمان: التحقق من اسم قاعدة البيانات للتأكد من أنها ليست بيئة إنتاجية
-- (يفترض في بيئة الإنتاج أن يكون اسم قاعدة البيانات مختلفاً، أو نتأكد برمجياً)
DO $$
BEGIN
    IF current_database() IN ('nama_prod', 'nama_production', 'namamedical_prod') THEN
        RAISE EXCEPTION 'خطأ فادح: محاولة تشغيل سكربت RLS التجريبي على قاعدة بيانات إنتاجية! تم إلغاء العملية.';
    END IF;
END $$;

-- 2. إعداد قيم الجلسة التجريبية الحالية (Session Context)
-- نقوم بضبط المعرفات لمحاكاة مستخدم ينتمي للمستأجر 1 والمنشأة 1
SET app.tenant_id = '1';
SET app.facility_id = '1';
SET app.branch_id = '1';

\echo 'تم ضبط قيم الجلسة بنجاح: app.tenant_id = 1, app.facility_id = 1'

-- 3. تفعيل RLS على 3 جداول تجريبية محددة فقط كخطوة أولى
-- الجداول المستهدفة: patients, invoices, appointments

-- أ. جدول المرضى (patients)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS test_patients_policy ON patients;
CREATE POLICY test_patients_policy ON patients
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- ب. جدول الفواتير (invoices)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS test_invoices_policy ON invoices;
CREATE POLICY test_invoices_policy ON invoices
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- ج. جدول المواعيد (appointments)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS test_appointments_policy ON appointments;
CREATE POLICY test_appointments_policy ON appointments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

\echo 'تم تفعيل RLS وإنشاء السياسات التجريبية على جداول: patients, invoices, appointments'
