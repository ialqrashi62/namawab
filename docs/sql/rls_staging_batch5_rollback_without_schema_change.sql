-- Rollback Batch 5 RLS Enablement on Staging
-- ============================================================================

-- 1. Disable RLS on the selected tables
ALTER TABLE emergency_beds DISABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_sales DISABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_sale_items DISABLE ROW LEVEL SECURITY;

-- 2. Drop the policies
DROP POLICY IF EXISTS rls_emergency_beds_tenant_isolation ON emergency_beds;
DROP POLICY IF EXISTS rls_pharmacy_sales_tenant_isolation ON pharmacy_sales;
DROP POLICY IF EXISTS rls_pharmacy_sale_items_tenant_isolation ON pharmacy_sale_items;

-- 3. Clean up test role permissions for these tables
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        REVOKE ALL ON emergency_beds FROM test_rls_user;
        REVOKE ALL ON pharmacy_sales FROM test_rls_user;
        REVOKE ALL ON pharmacy_sale_items FROM test_rls_user;
    END IF;
END $$;
