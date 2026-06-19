-- SQL No-Op Safety Checks & Query Simulation
-- نظام نما الطبي (NamaMedical) - بيئة Staging
-- يحاكي هذا الملف استعلامات العزل والتحقق الآمن على بيئة التطوير دون إجراء تعديلات أو تفعيل فعلي.

-- 1. محاكاة معاملة معزولة لتعيين سياق المستأجر (Tenant A) واسترجاع غرف العمليات التابعة له
BEGIN;
    -- تعيين سياق المستأجر الأول مؤقتاً في جلسة العمل الحالية
    SELECT set_config('app.tenant_id', '1', true);
    
    -- الاستعلام التجريبي ومحاكاة شرط سياسة RLS المقترحة للتحقق من العزل
    SELECT id, room_name, room_name_ar, location, tenant_id, branch_id
    FROM operating_rooms
    WHERE tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer;
ROLLBACK;

-- 2. محاكاة معاملة معزولة لتعيين سياق مستأجر وهمي آخر (Tenant B) والتحقق من عدم رؤية غرف العمليات السابقة
BEGIN;
    -- تعيين سياق مستأجر مختلف (Tenant 99)
    SELECT set_config('app.tenant_id', '99', true);
    
    -- يجب ألا يرجع هذا الاستعلام أي نتائج (خلو غرف العمليات للمستأجر 99)
    SELECT id, room_name, room_name_ar, location, tenant_id, branch_id
    FROM operating_rooms
    WHERE tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer;
ROLLBACK;

-- 3. شرح مسار الاستعلام (EXPLAIN) للتأكد من فاعلية الفهرس الهجين الحالي على surgeries
EXPLAIN (ANALYZE, COSTS OFF)
SELECT * 
FROM surgeries 
WHERE tenant_id = 1 AND facility_id = 1;
