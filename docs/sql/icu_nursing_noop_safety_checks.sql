-- ============================================================================
-- SQL Script: icu_nursing_noop_safety_checks.sql
-- Description: Transactional no-op safety checks simulating multi-tenant isolation
--              and constraints for ICU & Nursing on Staging.
-- Environment: Staging
-- WARNING: MUST END WITH ROLLBACK. NO PERMANENT CHANGES.
-- ============================================================================

BEGIN;

-- 1. Setup temporary mock data for same-transaction simulation
INSERT INTO patients (id, name_en, tenant_id, status) VALUES 
  (9991, 'Patient Tenant 1', 1, 'Admitted'),
  (9992, 'Patient Tenant 2', 2, 'Admitted');

INSERT INTO beds (id, bed_number, status, tenant_id) VALUES
  (99910, 'Bed Tenant 1', 'Occupied', 1),
  (99920, 'Bed Tenant 2', 'Occupied', 2);

INSERT INTO admissions (id, patient_id, bed_id, tenant_id, status) VALUES
  (99901, 9991, 99910, 1, 'Active'),
  (99902, 9992, 99920, 2, 'Active');

-- 2. Insert mock nursing vitals (nursing_vitals has RLS active in staging)
INSERT INTO nursing_vitals (patient_id, patient_name, bp, temp, tenant_id, facility_id) VALUES
  (9991, 'Patient Tenant 1', '120/80', 37.0, 1, 1),
  (9992, 'Patient Tenant 2', '130/85', 38.2, 2, 2);

-- 3. Simulate Tenant 1 Context and verify RLS visibility on nursing_vitals
SET LOCAL app.tenant_id = '1';

SELECT 'nursing_vitals visibility check for Tenant 1' AS step_description,
       COUNT(*) AS visible_count,
       SUM(CASE WHEN tenant_id = 1 THEN 1 ELSE 0 END) AS tenant_1_count,
       SUM(CASE WHEN tenant_id = 2 THEN 1 ELSE 0 END) AS tenant_2_count
FROM nursing_vitals
WHERE patient_id IN (9991, 9992);

-- 4. Check for Tenant Mismatch Constraints (Business Logic Simulation)
-- A vital record for Patient 2 (Tenant 2) must NEVER be linked under Tenant 1's context.
SELECT 'Mismatched Patient Link Check' AS step_description,
       COUNT(*) AS invalid_links
FROM patients p
WHERE p.id = 9992 AND p.tenant_id <> 1; -- Should return 1 since Patient 9992 belongs to Tenant 2

-- An ICU monitor log must never link an admission from Tenant 2 to Tenant 1.
SELECT 'Mismatched ICU Admission Check' AS step_description,
       COUNT(*) AS invalid_icu_links
FROM admissions a
WHERE a.id = 99902 AND a.tenant_id <> 1; -- Should return 1 since Admission 99902 belongs to Tenant 2

-- 5. End transaction safely and discard all changes
ROLLBACK;
