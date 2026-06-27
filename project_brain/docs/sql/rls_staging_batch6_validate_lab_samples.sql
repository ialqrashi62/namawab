-- Validation SQL scripts for testing Batch 6 RLS Enablement on lab_samples
-- ============================================================================

-- 1. Setup testing role if not exists and grant access to lab_samples
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        CREATE ROLE test_rls_user WITH LOGIN;
    END IF;
    GRANT SELECT, INSERT, UPDATE, DELETE ON lab_samples TO test_rls_user;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO test_rls_user;
END $$;

-- 2. Test Select lab_samples as Tenant 1
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
SELECT 'Tenant 1 lab_samples count' as label, COUNT(*) FROM lab_samples;
RESET ROLE;
COMMIT;

-- 3. Test Select lab_samples as Tenant 2
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '2';
SELECT 'Tenant 2 lab_samples count' as label, COUNT(*) FROM lab_samples;
RESET ROLE;
COMMIT;

-- 4. Test INSERT mismatch on lab_samples (should fail under RLS)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
-- Trying to insert tenant 2 row under tenant 1 context should fail
INSERT INTO lab_samples (order_id, sample_type, barcode, status, tenant_id) 
VALUES (1, 'TEST_BATCH6_FRAUD', 'BAR-FRAUD', 'Collected', 2);
RESET ROLE;
ROLLBACK;

-- 5. Test UPDATE cross-tenant on lab_samples (should fail/update 0 rows)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '2';
-- Trying to update tenant 1 sample under tenant 2 context should update 0 rows
UPDATE lab_samples SET status = 'Received' WHERE sample_type = 'TEST_BATCH6_S1';
RESET ROLE;
ROLLBACK;
