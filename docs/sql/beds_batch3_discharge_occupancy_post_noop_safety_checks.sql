-- ============================================================================
-- SQL Script: beds_batch3_discharge_occupancy_post_noop_safety_checks.sql
-- Description: Post-implementation no-op safety checks for Discharge & Occupancy operations under RLS
-- Environment: Staging
-- WARNING: Runs inside a transaction and ALWAYS rolls back. NO permanent changes.
-- ============================================================================

BEGIN;

-- 1. Setup Tenant Session context (Tenant 1)
SET LOCAL app.tenant_id = '1';

-- 2. Mocking operational context: Check source of truth for Bed Occupancy
-- Inspect beds belonging to Tenant 1
SELECT id AS bed_id, bed_number, room_number, status AS bed_status_field, current_patient_id, current_admission_id
FROM beds
LIMIT 5;

-- 3. Simulate Occupancy / Census calculation for Tenant 1
-- Confirm only beds and wards of Tenant 1 are counted
SELECT 
    (SELECT COUNT(*) FROM beds WHERE tenant_id = 1) AS total_beds_tenant_1,
    (SELECT COUNT(*) FROM beds WHERE tenant_id = 1 AND status = 'Occupied') AS occupied_beds_tenant_1,
    (SELECT COUNT(*) FROM beds WHERE tenant_id = 1 AND status = 'Available') AS available_beds_tenant_1;

-- 4. Try to simulate discharging a patient (Tenant 1 discharging admission belonging to Tenant 1)
-- Insert a mock patient and bed for Tenant 1 to link
INSERT INTO patients (id, name_ar, name_en, tenant_id) 
VALUES (99991, 'مريض تجريبي 1', 'Mock Patient 1', 1) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO beds (id, bed_number, room_number, status, tenant_id) 
VALUES (99991, 'T1-B99', 'Room 99', 'Occupied', 1) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO admissions (id, patient_id, patient_name, ward_id, bed_id, status, tenant_id) 
VALUES (99991, 99991, 'Mock Patient 1', 1, 99991, 'Active', 1)
ON CONFLICT (id) DO NOTHING;

-- Perform discharge updates (status change, date, and bed status release)
UPDATE admissions 
SET status = 'Discharged', 
    discharge_date = TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS'),
    discharge_type = 'Regular',
    discharge_summary = 'Mock discharge summary for security verification'
WHERE id = 99991 AND tenant_id = 1;

UPDATE beds 
SET status = 'Available', 
    current_patient_id = 0, 
    current_admission_id = 0 
WHERE id = 99991 AND tenant_id = 1;

UPDATE patients 
SET status = 'Discharged' 
WHERE id = 99991 AND tenant_id = 1;

-- Verify they are updated correctly
SELECT id, status, discharge_date FROM admissions WHERE id = 99991;
SELECT id, status FROM beds WHERE id = 99991;

-- 5. SIMULATE AN ATTACK: Attempt to discharge or release a bed for Tenant 2 while session is Tenant 1
-- (This should not modify any records because the row is invisible to Tenant 1 or blocked by RLS)
UPDATE admissions 
SET status = 'Discharged', 
    discharge_date = TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')
WHERE tenant_id = 2; -- Will affect 0 rows or fail because RLS filters out tenant_id = 2

UPDATE beds 
SET status = 'Available'
WHERE tenant_id = 2; -- Will affect 0 rows or fail due to RLS filtering

-- 6. Simulate Available Beds Calculation
-- Make sure it does not leak Tenant 2 beds
SELECT COUNT(*) AS tenant_1_available_beds_count
FROM beds 
WHERE status = 'Available'; -- RLS will automatically apply 'tenant_id = 1' filter

-- 7. Clean up by rolling back transaction
ROLLBACK;
