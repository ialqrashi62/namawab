-- Final RLS Coverage Inventory Read-Only Queries
-- نظام نما الطبي (NamaMedical) - مراجعة التغطية النهائية لسياسات عزل المستأجرين
-- يقوم هذا السكربت بفحص هيكلة وجداول قاعدة البيانات والسياسات المطبقة للقراءة فقط دون إحداث أي تغيير.

-- 1. الاستعلام العام لجميع الجداول وحالة الـ RLS والسياسات والأعمدة الحساسة
SELECT 
    c.relname AS table_name,
    c.relrowsecurity AS rls_enabled,
    c.relforcerowsecurity AS rls_forced,
    (SELECT count(*) FROM pg_policy p WHERE p.polrelid = c.oid) AS policy_count,
    (SELECT string_agg(p.polname, ', ') FROM pg_policy p WHERE p.polrelid = c.oid) AS policy_names,
    EXISTS (SELECT 1 FROM information_schema.columns col WHERE col.table_schema = 'public' AND col.table_name = c.relname AND col.column_name = 'tenant_id') AS has_tenant_id,
    EXISTS (SELECT 1 FROM information_schema.columns col WHERE col.table_schema = 'public' AND col.table_name = c.relname AND col.column_name IN ('facility_id', 'branch_id')) AS has_facility_branch_id,
    EXISTS (SELECT 1 FROM information_schema.columns col WHERE col.table_schema = 'public' AND col.table_name = c.relname AND col.column_name = 'patient_id') AS has_patient_id,
    EXISTS (SELECT 1 FROM information_schema.columns col WHERE col.table_schema = 'public' AND col.table_name = c.relname AND col.column_name = 'admission_id') AS has_admission_id
FROM 
    pg_class c
JOIN 
    pg_namespace n ON n.oid = c.relnamespace
WHERE 
    n.nspname = 'public'
    AND c.relkind = 'r'
    AND c.relname NOT IN ('spatial_ref_sys')
ORDER BY 
    c.relname;

-- 2. التحقق من تفاصيل السياسات الحالية في النظام
SELECT 
    tablename,
    policyname,
    schemaname,
    roles,
    cmd,
    qual,
    with_check
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, policyname;

-- 3. استعلام للتحقق من الفهارس المرتبطة بـ tenant_id
SELECT
    t.relname AS table_name,
    i.relname AS index_name,
    a.attname AS column_name
FROM
    pg_class t
JOIN
    pg_index ix ON t.oid = ix.indrelid
JOIN
    pg_class i ON i.oid = ix.indexrelid
JOIN
    pg_attribute a ON t.oid = a.attrelid AND a.attnum = ANY(ix.indkey)
WHERE
    t.relkind = 'r'
    AND t.relname NOT IN ('spatial_ref_sys')
    AND a.attname = 'tenant_id'
ORDER BY
    t.relname, i.relname;
