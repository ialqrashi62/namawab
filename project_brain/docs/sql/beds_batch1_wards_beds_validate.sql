-- ============================================================================
-- SQL Script: beds_batch1_wards_beds_validate.sql
-- Description: Validation queries to verify schema and RLS isolation for Wards & Beds
-- Environment: Staging
-- ============================================================================

-- 1. Setup testing role and grant access
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        CREATE ROLE test_rls_user WITH LOGIN;
    END IF;
    GRANT SELECT, INSERT, UPDATE, DELETE ON wards TO test_rls_user;
    GRANT SELECT, INSERT, UPDATE, DELETE ON beds TO test_rls_user;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO test_rls_user;
END $$;

-- 2. Test Select wards/beds as Tenant 1
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
SELECT 'Tenant 1 Wards Count' as label, COUNT(*) FROM wards;
SELECT 'Tenant 1 Beds Count' as label, COUNT(*) FROM beds;
RESET ROLE;
COMMIT;

-- 3. Test Select wards/beds as Tenant 2
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '2';
SELECT 'Tenant 2 Wards Count' as label, COUNT(*) FROM wards;
SELECT 'Tenant 2 Beds Count' as label, COUNT(*) FROM beds;
RESET ROLE;
COMMIT;

-- 4. Test INSERT mismatch on wards (should fail under RLS)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
-- Trying to insert tenant 2 row under tenant 1 context should fail
INSERT INTO wards (ward_name, ward_name_ar, tenant_id, branch_id) 
VALUES ('Test Ward T2', 'جناح تجريبي 2', 2, 1);
RESET ROLE;
ROLLBACK;

-- 5. Test UPDATE cross-tenant on beds (should affect 0 rows)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '2';
-- Trying to update tenant 1 bed under tenant 2 context should update 0 rows
UPDATE beds SET notes = 'Malicious Update' WHERE tenant_id = 1;
RESET ROLE;
ROLLBACK;
