-- Validation SQL scripts for testing Batch 2 invoices RLS Enablement
-- ============================================================================

-- 1. Setup testing role if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        CREATE ROLE test_rls_user WITH LOGIN;
    END IF;
    GRANT SELECT, INSERT, UPDATE, DELETE ON invoices TO test_rls_user;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO test_rls_user;
END $$;

-- 2. Test Select as Tenant 1 (should see existing data for tenant 1)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
SELECT 'Tenant 1 invoices count' as label, COUNT(*) FROM invoices;
RESET ROLE;
COMMIT;

-- 3. Test Select as Tenant 2 (should see 0 rows from tenant 1)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '2';
SELECT 'Tenant 2 invoices count (should be 0)' as label, COUNT(*) FROM invoices;
RESET ROLE;
COMMIT;

-- 4. Test INSERT mismatch (should throw RLS violation)
BEGIN;
SET ROLE test_rls_user;
SET LOCAL app.tenant_id = '1';
-- Trying to insert tenant 2 row under tenant 1 context should fail
INSERT INTO invoices (invoice_number, amount, tenant_id) VALUES ('INV-BATCH2-FRAUD', 150, 2);
RESET ROLE;
ROLLBACK;
