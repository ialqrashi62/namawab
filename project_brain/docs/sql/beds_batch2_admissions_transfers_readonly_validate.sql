-- beds_batch2_admissions_transfers_readonly_validate.sql
-- =========================================================================
-- وصف: سكربت التحقق للقراءة فقط (Read-only) لفحص هيكلية وجداول Admissions و Bed Transfers.
-- البيئة المستهدفة: Staging / Local PostgreSQL (NamaMedical)
-- الصلاحية المطلوبة: Read-only access to catalogs and operational tables
-- =========================================================================

-- 1. فحص وجود ومواصفات جداول الدفعة الثانية في الكتالوج (Table Definitions)
SELECT 
    table_schema, 
    table_name, 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_name IN ('admissions', 'bed_transfers', 'admission_daily_rounds')
ORDER BY 
    table_name, ordinal_position;

-- 2. التحقق من حالة RLS (Row-Level Security) الحالية للجداول المستهدفة
SELECT 
    schemaname, 
    tablename, 
    rowsecurity, 
    hasindexes
FROM 
    pg_tables
WHERE 
    tablename IN ('admissions', 'bed_transfers', 'admission_daily_rounds');

-- 3. استعراض الفهارس القائمة (Existing Indexes) على جداول الدفعة الثانية
SELECT 
    tablename, 
    indexname, 
    indexdef 
FROM 
    pg_indexes 
WHERE 
    tablename IN ('admissions', 'bed_transfers', 'admission_daily_rounds')
ORDER BY 
    tablename, indexname;

-- 4. إحصائيات عامة حول توزيع السجلات بين المستأجرين (Tenant Data Distribution)
SELECT 
    'admissions' AS table_name,
    tenant_id,
    COUNT(*) as record_count,
    COUNT(CASE WHEN tenant_id IS NULL THEN 1 END) as null_tenant_count
FROM 
    admissions
GROUP BY 
    tenant_id

UNION ALL

SELECT 
    'bed_transfers' AS table_name,
    tenant_id,
    COUNT(*) as record_count,
    COUNT(CASE WHEN tenant_id IS NULL THEN 1 END) as null_tenant_count
FROM 
    bed_transfers
GROUP BY 
    tenant_id;

-- 5. فحص تكامل المفاتيح الأجنبية والروابط الهيكلية (Foreign Keys Check)
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE 
    tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name IN ('admissions', 'bed_transfers', 'admission_daily_rounds');
