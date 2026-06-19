-- ============================================================================
-- SQL Script: catalog_override_candidate_validate.sql
-- Description: Read-only validations for medical catalogs and reference tables.
-- Purpose: Verify column existence, row counts, and current RLS configurations.
-- Environment: Staging
-- ============================================================================

-- 1. Check existence of tenant_id column across medical catalog tables
SELECT 
    table_name,
    EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = t.table_name AND column_name = 'tenant_id'
    ) AS has_tenant_id
FROM (
    VALUES 
        ('medications'),
        ('lab_tests_catalog'),
        ('radiology_catalog'),
        ('medical_services'),
        ('icd10_codes'),
        ('pharmacy_drug_catalog'),
        ('wards'),
        ('beds'),
        ('operating_rooms'),
        ('insurance_companies'),
        ('insurance_contracts'),
        ('insurance_policies'),
        ('finance_chart_of_accounts'),
        ('form_templates')
) AS t(table_name)
ORDER BY table_name;

-- 2. Count rows in key catalog tables
SELECT 'medications' AS table_name, COUNT(*) AS row_count FROM medications
UNION ALL
SELECT 'lab_tests_catalog', COUNT(*) FROM lab_tests_catalog
UNION ALL
SELECT 'radiology_catalog', COUNT(*) FROM radiology_catalog
UNION ALL
SELECT 'medical_services', COUNT(*) FROM medical_services
UNION ALL
SELECT 'icd10_codes', COUNT(*) FROM icd10_codes
UNION ALL
SELECT 'pharmacy_drug_catalog', COUNT(*) FROM pharmacy_drug_catalog;

-- 3. Verify row distributions for existing tenant-scoped operational tables
SELECT 
    'beds' AS table_name, 
    tenant_id, 
    COUNT(*) AS row_count,
    COUNT(*) FILTER (WHERE tenant_id IS NULL) AS null_tenant_count
FROM beds 
GROUP BY tenant_id
UNION ALL
SELECT 
    'wards', 
    tenant_id, 
    COUNT(*),
    COUNT(*) FILTER (WHERE tenant_id IS NULL)
FROM wards 
GROUP BY tenant_id
UNION ALL
SELECT 
    'operating_rooms', 
    tenant_id, 
    COUNT(*),
    COUNT(*) FILTER (WHERE tenant_id IS NULL)
FROM operating_rooms 
GROUP BY tenant_id
UNION ALL
SELECT 
    'pharmacy_drug_catalog', 
    tenant_id, 
    COUNT(*),
    COUNT(*) FILTER (WHERE tenant_id IS NULL)
FROM pharmacy_drug_catalog 
GROUP BY tenant_id;

-- 4. Check active RLS status for catalog tables
SELECT 
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
      'medications', 'lab_tests_catalog', 'radiology_catalog', 
      'medical_services', 'icd10_codes', 'pharmacy_drug_catalog', 
      'beds', 'wards', 'operating_rooms'
  );
