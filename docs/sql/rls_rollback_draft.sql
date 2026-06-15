-- ============================================================================
-- مسودة سكربت التراجع وتعطيل RLS محلياً (RLS Local Rollback Draft)
-- المشروع: نظام نما الطبي (NamaMedical)
-- الملف: docs/sql/rls_rollback_draft.sql
-- التحذير: للاستخدام التجريبي/المحلي فقط لتنظيف بيئة التطوير
-- لا يحذف أي بيانات إطلاقاً.
-- ============================================================================

\echo '========================================================'
\echo '  بدء عملية التراجع وتعطيل Row-Level Security محلياً'
\echo '========================================================'

-- 1. تعطيل RLS وحذف السياسات الخاصة بجدول المرضى (patients)
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS test_patients_policy ON patients;
DROP POLICY IF EXISTS tenant_isolation_patients_select ON patients;
DROP POLICY IF EXISTS tenant_isolation_patients_insert ON patients;
DROP POLICY IF EXISTS tenant_isolation_patients_update ON patients;
DROP POLICY IF EXISTS tenant_isolation_patients_delete ON patients;

-- 2. تعطيل RLS وحذف السياسات الخاصة بجدول الفواتير (invoices)
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS test_invoices_policy ON invoices;

-- 3. تعطيل RLS وحذف السياسات الخاصة بجدول المواعيد (appointments)
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS test_appointments_policy ON appointments;

-- 4. تنظيف الدوال المساعدة التجريبية (اختياري)
DROP FUNCTION IF EXISTS get_app_tenant_id();
DROP FUNCTION IF EXISTS get_app_facility_id();
DROP FUNCTION IF EXISTS get_app_branch_id();

\echo 'تم تعطيل RLS وحذف جميع السياسات المضافة بنجاح وتنظيف البيئة المحلية.'
