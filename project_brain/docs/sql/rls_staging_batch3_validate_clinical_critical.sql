-- Validation SQL scripts for testing Batch 3 clinical RLS Enablement
-- ============================================================================

-- 1. Setup testing role if not exists and grant access to the 4 clinical tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        CREATE ROLE test_rls_user WITH LOGIN;
    END IF;
    GRANT SELECT, INSERT, UPDATE, DELETE ON prescriptions TO test_rls_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON lab_radiology_orders TO test_rls_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON emergency_visits TO test_rls_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON nursing_vitals TO test_rls_user;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO test_rls_user;
END $$;

-- 2. Test Select prescriptions as Tenant 1 (should succeed, returning 0 rows)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
SELECT 'Tenant 1 prescriptions count' as label, COUNT(*) FROM prescriptions;
RESET ROLE;
COMMIT;

-- 3. Test Select prescriptions as Tenant 2 (should succeed, returning 0 rows)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '2';
SELECT 'Tenant 2 prescriptions count' as label, COUNT(*) FROM prescriptions;
RESET ROLE;
COMMIT;

-- 4. Test INSERT mismatch on nursing_vitals (should throw RLS violation)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
-- Trying to insert tenant 2 row under tenant 1 context should fail
INSERT INTO nursing_vitals (patient_id, patient_name, bp, temp, tenant_id) VALUES (999, 'Test Patient', '120/80', 37.0, 2);
RESET ROLE;
ROLLBACK;
