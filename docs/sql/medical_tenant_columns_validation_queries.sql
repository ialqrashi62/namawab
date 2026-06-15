-- ============================================================================
-- NAMA MEDICAL SYSTEM - TENANT ISOLATION VALIDATION QUERIES (PLANNING ONLY)
-- File: docs/sql/medical_tenant_columns_validation_queries.sql
-- Description: Queries to audit migration success, count remaining NULL scopes,
--              and identify potential orphan or unmapped relational keys.
-- FOR REVIEW AND LOCAL DRY RUN ONLY
-- ============================================================================

-- 1. COUNT OF REMAINING NULLS ON CRITICAL TABLES (AUDITING COMPLETENESS)
-- ----------------------------------------------------------------------------
SELECT 'patients' as table_name, COUNT(*) as null_count FROM patients WHERE tenant_id IS NULL OR facility_id IS NULL
UNION ALL
SELECT 'invoices' as table_name, COUNT(*) as null_count FROM invoices WHERE tenant_id IS NULL OR facility_id IS NULL
UNION ALL
SELECT 'medical_records' as table_name, COUNT(*) as null_count FROM medical_records WHERE tenant_id IS NULL OR facility_id IS NULL
UNION ALL
SELECT 'appointments' as table_name, COUNT(*) as null_count FROM appointments WHERE tenant_id IS NULL OR branch_id IS NULL
UNION ALL
SELECT 'prescriptions' as table_name, COUNT(*) as null_count FROM prescriptions WHERE tenant_id IS NULL OR facility_id IS NULL
UNION ALL
SELECT 'lab_radiology_orders' as table_name, COUNT(*) as null_count FROM lab_radiology_orders WHERE tenant_id IS NULL OR facility_id IS NULL
UNION ALL
SELECT 'pharmacy_prescriptions_queue' as table_name, COUNT(*) as null_count FROM pharmacy_prescriptions_queue WHERE tenant_id IS NULL OR branch_id IS NULL
UNION ALL
SELECT 'hr_employees' as table_name, COUNT(*) as null_count FROM hr_employees WHERE tenant_id IS NULL OR facility_id IS NULL OR branch_id IS NULL
UNION ALL
SELECT 'inventory_items' as table_name, COUNT(*) as null_count FROM inventory_items WHERE tenant_id IS NULL OR branch_id IS NULL;


-- 2. DETECTING ORPHAN PATIENT RECORDS (NOT CORRESPONDING TO EXISTING TENANTS)
-- ----------------------------------------------------------------------------
SELECT id, name_ar, name_en, tenant_id 
FROM patients 
WHERE tenant_id IS NOT NULL 
  AND tenant_id NOT IN (SELECT id FROM tenants);


-- 3. DETECTING ORPHAN INVOICE RECORDS
-- ----------------------------------------------------------------------------
SELECT id, invoice_number, patient_name, tenant_id 
FROM invoices 
WHERE tenant_id IS NOT NULL 
  AND tenant_id NOT IN (SELECT id FROM tenants);


-- 4. DETECTING CROSS-TENANT PATIENT-TO-RECORD MISMATCHES
-- ----------------------------------------------------------------------------
-- Warns if a medical record is linked to a patient in a different tenant context
SELECT mr.id as record_id, mr.patient_id, mr.tenant_id as record_tenant, p.tenant_id as patient_tenant
FROM medical_records mr
JOIN patients p ON mr.patient_id = p.id
WHERE mr.tenant_id != p.tenant_id;


-- 5. DETECTING CROSS-TENANT PATIENT-TO-INVOICE MISMATCHES
-- ----------------------------------------------------------------------------
-- Warns if an invoice is linked to a patient in a different tenant context
SELECT inv.id as invoice_id, inv.patient_id, inv.tenant_id as invoice_tenant, p.tenant_id as patient_tenant
FROM invoices inv
JOIN patients p ON inv.patient_id = p.id
WHERE inv.tenant_id != p.tenant_id;


-- 6. TOTAL COUNT OF RECORD DISTRIBUTIONS PER TENANT (DASHBOARD METRIC CHECK)
-- ----------------------------------------------------------------------------
SELECT tenant_id, COUNT(*) as patient_count
FROM patients
GROUP BY tenant_id;

SELECT tenant_id, COUNT(*) as invoice_count, SUM(total) as total_amount
FROM invoices
GROUP BY tenant_id;
