-- ============================================================================
-- مسودة تصميم سياسات الأمان على مستوى الصف (Row-Level Security - RLS)
-- المشروع: نظام نما الطبي (NamaMedical)
-- الملف: docs/sql/rls_design_policy_draft.sql
-- الحالة: مسودة للتجربة والتطوير محلياً فقط - يمنع تشغيلها مباشرة على الإنتاج
-- الترميز: UTF-8 (العربية)
-- ============================================================================

/*
  تشرح هذه المسودة كيفية تطبيق عزل المستأجرين على مستوى قاعدة البيانات باستخدام سياسات RLS.
  نعتمد هنا على إعدادات جلسة العمل (Session Settings) الخاصة بـ PostgreSQL لتهيئة السياق:
    - app.tenant_id: المعرف الفرعي للمستأجر الحالي
    - app.facility_id: المعرف الفرعي للمنشأة الحالية (اختياري)
    - app.branch_id: المعرف الفرعي للفرع/المستودع الحالي (اختياري)
*/

-- ----------------------------------------------------------------------------
-- أولاً: تعريف الدوال المساعدة لتسهيل جلب قيم الجلسة والتحقق من النوع والتحويل الآمن
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_app_tenant_id()
RETURNS INTEGER AS $$
BEGIN
    RETURN NULLIF(current_setting('app.tenant_id', true), '')::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_app_facility_id()
RETURNS INTEGER AS $$
BEGIN
    RETURN NULLIF(current_setting('app.facility_id', true), '')::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_app_branch_id()
RETURNS INTEGER AS $$
BEGIN
    RETURN NULLIF(current_setting('app.branch_id', true), '')::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================================
-- الفئة (أ): جداول معزولة مباشرة حسب المستأجر (Direct Tenant Scoped Tables)
-- ============================================================================
-- يتم تفعيل RLS وفرض مطابقة tenant_id مع متغير الجلسة get_app_tenant_id() لجميع العمليات.

-- مثال 1: جدول المرضى (patients)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_patients_select ON patients
    FOR SELECT
    USING (tenant_id = get_app_tenant_id());

CREATE POLICY tenant_isolation_patients_insert ON patients
    FOR INSERT
    WITH CHECK (tenant_id = get_app_tenant_id());

CREATE POLICY tenant_isolation_patients_update ON patients
    FOR UPDATE
    USING (tenant_id = get_app_tenant_id())
    WITH CHECK (tenant_id = get_app_tenant_id());

CREATE POLICY tenant_isolation_patients_delete ON patients
    FOR DELETE
    USING (tenant_id = get_app_tenant_id()); -- يفضل تعطيل الحذف الفعلي وتفضيل soft delete


-- تطبيق نفس النمط على بقية جداول المستأجر المباشرة:
-- (ملاحظة: السكربت يذكرها كمثال توضيحي للهيكلية الكاملة)

-- جدول الوصفات الطبية (prescriptions)
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_prescriptions ON prescriptions
    FOR ALL USING (tenant_id = get_app_tenant_id()) WITH CHECK (tenant_id = get_app_tenant_id());

-- جدول ملفات المرضى (medical_records)
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_medical_records ON medical_records
    FOR ALL USING (tenant_id = get_app_tenant_id()) WITH CHECK (tenant_id = get_app_tenant_id());

-- جدول طلبات المختبر والأشعة (lab_radiology_orders)
ALTER TABLE lab_radiology_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_lab_radiology_orders ON lab_radiology_orders
    FOR ALL USING (tenant_id = get_app_tenant_id()) WITH CHECK (tenant_id = get_app_tenant_id());

-- جدول كتالوج أدوية الصيدلية (pharmacy_drug_catalog)
ALTER TABLE pharmacy_drug_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_pharmacy_drug_catalog ON pharmacy_drug_catalog
    FOR ALL USING (tenant_id = get_app_tenant_id()) WITH CHECK (tenant_id = get_app_tenant_id());


-- ============================================================================
-- الفئة (ب): جداول معزولة حسب المستأجر والمنشأة (Facility Scoped Tables)
-- ============================================================================
-- تفرض التحقق من tenant_id بشكل إلزامي، وتسمح بالتحقق من facility_id إذا تم ضبطه في الجلسة.

-- جدول التنويم (admissions)
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_facility_isolation_admissions ON admissions
    FOR ALL
    USING (
        tenant_id = get_app_tenant_id() AND
        (get_app_facility_id() IS NULL OR facility_id = get_app_facility_id())
    )
    WITH CHECK (
        tenant_id = get_app_tenant_id() AND
        (get_app_facility_id() IS NULL OR facility_id = get_app_facility_id())
    );


-- ============================================================================
-- الفئة (ج): جداول معزولة حسب المستأجر والفرع/المستودع (Branch/Warehouse Scoped Tables)
-- ============================================================================
-- تفرض التحقق من tenant_id بشكل إلزامي، وتسمح بالتحقق من branch_id إذا تم ضبطه في الجلسة.

-- جدول عناصر المخزون (inventory_items)
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_branch_isolation_inventory ON inventory_items
    FOR ALL
    USING (
        tenant_id = get_app_tenant_id() AND
        (get_app_branch_id() IS NULL OR branch_id = get_app_branch_id())
    )
    WITH CHECK (
        tenant_id = get_app_tenant_id() AND
        (get_app_branch_id() IS NULL OR branch_id = get_app_branch_id())
    );

-- جدول حركات المخزون والطلبات (inventory_dept_requests)
ALTER TABLE inventory_dept_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_branch_isolation_dept_requests ON inventory_dept_requests
    FOR ALL
    USING (
        tenant_id = get_app_tenant_id() AND
        (get_app_branch_id() IS NULL OR branch_id = get_app_branch_id())
    )
    WITH CHECK (
        tenant_id = get_app_tenant_id() AND
        (get_app_branch_id() IS NULL OR branch_id = get_app_branch_id())
    );


-- ============================================================================
-- الفئة (د): الجداول العامة / المرجعية (Global & Reference Tables)
-- ============================================================================
-- جداول مشتركة للنظام أو بدون عزل RLS مباشر لأنها لا تحتوي على بيانات مستأجرين أو تمثل lookup.
-- 1. tenants, facilities, branches (بيانات البنية الأساسية)
-- 2. icd10_codes (التصنيف الدولي للأمراض)
-- 3. lab_tests_catalog, radiology_catalog (كتالوج الخدمات العامة)
-- 4. system_users (يتم عزلها برمجياً أو عبر RLS خاص بالمستخدمين المشتركين)


-- ============================================================================
-- الفئة (هـ): جداول مؤجلة القرار (Deferred Decision Tables)
-- ============================================================================
-- الجداول التي لا تحتوي على عمود tenant_id بشكل مباشر وتحتاج لـ JOIN أو تعديل البنية مستقبلاً:
-- 1. pharmacy_stock_log (يعتمد حالياً في الاستعلامات البرمجية على JOIN مع pharmacy_drug_catalog)
-- 2. lookup_tables العامة
