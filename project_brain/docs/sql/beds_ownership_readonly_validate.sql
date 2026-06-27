-- ============================================================================
-- SQL Script: beds_ownership_readonly_validate.sql
-- Description: Read-only validation queries to inspect wards, beds, and admissions schemas and RLS.
-- Environment: Staging
-- ============================================================================

-- 1. Check Row-Level Security (RLS) status for beds-related tables
SELECT 
    tablename, 
    rowsecurity AS rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('wards', 'beds', 'emergency_beds', 'admissions', 'bed_transfers')
ORDER BY tablename;

-- 2. Inspect column structure and types for beds and wards tables
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('wards', 'beds', 'emergency_beds', 'admissions', 'bed_transfers')
ORDER BY table_name, ordinal_position;

-- 3. Verify active policies on beds and wards tables
SELECT 
    policyname, 
    tablename, 
    cmd, 
    qual, 
    with_check
FROM pg_policies
WHERE tablename IN ('wards', 'beds', 'emergency_beds', 'admissions', 'bed_transfers')
ORDER BY tablename, policyname;

-- 4. Check data counts and tenant/facility context distribution
SELECT 'wards' AS table_name, tenant_id, branch_id AS facility_branch_id, COUNT(*) AS row_count
FROM wards GROUP BY tenant_id, branch_id
UNION ALL
SELECT 'beds' AS table_name, tenant_id, branch_id AS facility_branch_id, COUNT(*) AS row_count
FROM beds GROUP BY tenant_id, branch_id
UNION ALL
SELECT 'emergency_beds' AS table_name, tenant_id, branch_id AS facility_branch_id, COUNT(*) AS row_count
FROM emergency_beds GROUP BY tenant_id, branch_id
UNION ALL
SELECT 'admissions' AS table_name, tenant_id, facility_id AS facility_branch_id, COUNT(*) AS row_count
FROM admissions GROUP BY tenant_id, facility_id
UNION ALL
SELECT 'bed_transfers' AS table_name, tenant_id, branch_id AS facility_branch_id, COUNT(*) AS row_count
FROM bed_transfers GROUP BY tenant_id, branch_id;

-- 5. Detect any records with NULL tenant_id
SELECT 'wards' AS table_name, COUNT(*) AS null_tenant_count FROM wards WHERE tenant_id IS NULL
UNION ALL
SELECT 'beds' AS table_name, COUNT(*) AS null_tenant_count FROM beds WHERE tenant_id IS NULL
UNION ALL
SELECT 'emergency_beds' AS table_name, COUNT(*) AS null_tenant_count FROM emergency_beds WHERE tenant_id IS NULL
UNION ALL
SELECT 'admissions' AS table_name, COUNT(*) AS null_tenant_count FROM admissions WHERE tenant_id IS NULL
UNION ALL
SELECT 'bed_transfers' AS table_name, COUNT(*) AS null_tenant_count FROM bed_transfers WHERE tenant_id IS NULL;
