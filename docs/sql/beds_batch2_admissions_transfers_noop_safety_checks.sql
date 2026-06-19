-- beds_batch2_admissions_transfers_noop_safety_checks.sql
-- =========================================================================
-- وصف: سكربت الفحص الصفي غير المعدل (No-op SQL) لمحاكاة قيود وسياسات عزل التنويم والتحويلات.
-- البيئة المستهدفة: Staging / Local PostgreSQL (NamaMedical)
-- الضمانة الأمنية: ينتهي السكربت بـ ROLLBACK إلزامي لضمان عدم حفظ أي تعديل أو إحداث أي تغيير هيكلي.
-- =========================================================================

BEGIN;

-- 1. محاكاة تعيين سياق المستأجر النشط (Tenant A = 1)
SELECT set_config('app.current_tenant_id', '1', true) AS simulated_tenant;

-- 2. محاكاة استعلام التنويم تحت سياق المستأجر (Active Admissions Lookup)
-- هذا الاستعلام يطابق السلوك المتوقع للـ RLS Policy مستقبلاً
SELECT 
    a.id AS admission_id,
    a.patient_name,
    a.department,
    a.ward_id,
    a.bed_id,
    a.status,
    a.tenant_id
FROM 
    admissions a
WHERE 
    a.tenant_id = current_setting('app.current_tenant_id')::integer;

-- 3. محاكاة استعلام سجلات نقل الأسرة التابعة للمستأجر الحالي
SELECT 
    bt.id AS transfer_id,
    bt.admission_id,
    bt.from_ward,
    bt.to_ward,
    bt.transfer_reason,
    bt.tenant_id
FROM 
    bed_transfers bt
WHERE 
    bt.tenant_id = current_setting('app.current_tenant_id')::integer;

-- 4. فحص تكامل سياق المستأجر في العلاقات (Tenant Cross-Reference Test)
-- التحقق من عدم ربط تنويم من مستأجر (A) بسرير أو مريض يتبع مستأجر آخر (B)
SELECT 
    a.id AS admission_id,
    p.id AS patient_id,
    p.tenant_id AS patient_tenant,
    b.id AS bed_id,
    b.tenant_id AS bed_tenant,
    a.tenant_id AS admission_tenant
FROM 
    admissions a
    JOIN patients p ON a.patient_id = p.id
    JOIN beds b ON a.bed_id = b.id
WHERE 
    a.tenant_id = 1
    AND (p.tenant_id <> a.tenant_id OR b.tenant_id <> a.tenant_id);
-- المخرجات المتوقعة: 0 صفوف (تطابق الهويات بنسبة 100%).

-- 5. إنهاء المعاملة الإلزامية بالتراجع الكامل (Strict No-op)
ROLLBACK;
-- \echo '✅ تم تشغيل فحص الأمان بنجاح والتراجع الكامل عن المعاملة دون إدخال أي تغييرات.'
