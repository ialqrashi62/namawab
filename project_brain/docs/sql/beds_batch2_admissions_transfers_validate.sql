-- ============================================================================
-- SQL Script: beds_batch2_admissions_transfers_validate.sql
-- Description: Validation queries to verify RLS isolation for Admissions & Bed Transfers
-- Environment: Staging
-- ============================================================================

-- 1. Setup testing role and grant access
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        CREATE ROLE test_rls_user WITH LOGIN;
    END IF;
    GRANT SELECT, INSERT, UPDATE, DELETE ON admissions TO test_rls_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON bed_transfers TO test_rls_user;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO test_rls_user;
END $$;

-- 2. Test Select admissions/transfers as Tenant 1
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
SELECT 'Tenant 1 Admissions Count' as label, COUNT(*) FROM admissions;
SELECT 'Tenant 1 Bed Transfers Count' as label, COUNT(*) FROM bed_transfers;
RESET ROLE;
COMMIT;

-- 3. Test Select admissions/transfers as Tenant 2
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '2';
SELECT 'Tenant 2 Admissions Count' as label, COUNT(*) FROM admissions;
SELECT 'Tenant 2 Bed Transfers Count' as label, COUNT(*) FROM bed_transfers;
RESET ROLE;
COMMIT;

-- 4. Test INSERT mismatch on admissions (should fail under RLS check)
-- Tenant 1 trying to insert an admission referencing a Patient from Tenant 2
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';

-- Inserting patient_id = 99 (belongs to Tenant 2) under Tenant 1 context should fail
INSERT INTO admissions (patient_id, patient_name, ward_id, bed_id, tenant_id, facility_id)
VALUES (99, 'Tenant 2 Patient', 10, 100, 1, 1);

RESET ROLE;
ROLLBACK;

-- 5. Test UPDATE cross-tenant on admissions (should affect 0 rows)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '2';

-- Trying to update tenant 1 admission under tenant 2 context should update 0 rows
UPDATE admissions SET diagnosis = 'Unauthorized Update' WHERE tenant_id = 1;

RESET ROLE;
ROLLBACK;
