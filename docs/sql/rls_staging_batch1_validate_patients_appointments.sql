-- Validation SQL scripts for testing Batch 1 RLS Enablement
-- ============================================================================

-- 1. Setup testing role if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        CREATE ROLE test_rls_user WITH LOGIN;
    END IF;
    GRANT SELECT, INSERT, UPDATE, DELETE ON patients, appointments TO test_rls_user;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO test_rls_user;
END $$;

-- 2. Test Select as Tenant 1 (should see existing data for tenant 1)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
SELECT 'Tenant 1 patients count' as label, COUNT(*) FROM patients;
SELECT 'Tenant 1 appointments count' as label, COUNT(*) FROM appointments;
RESET ROLE;
COMMIT;

-- 3. Test Select as Tenant 2 (should see 0 rows from tenant 1)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '2';
SELECT 'Tenant 2 patients count (should be 0)' as label, COUNT(*) FROM patients;
SELECT 'Tenant 2 appointments count (should be 0)' as label, COUNT(*) FROM appointments;
RESET ROLE;
COMMIT;

-- 4. Test INSERT mismatch (should throw RLS violation)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
-- Trying to insert tenant 2 row under tenant 1 context should fail
INSERT INTO patients (name_ar, tenant_id) VALUES ('TEST_BATCH1_FRAUD', 2);
RESET ROLE;
ROLLBACK;
