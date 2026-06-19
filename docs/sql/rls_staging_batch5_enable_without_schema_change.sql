-- Enable RLS for Batch 5 clinical and operational tables on Staging (Without Schema Change)
-- ============================================================================

-- 1. Enable RLS on selected tables
ALTER TABLE emergency_beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_sale_items ENABLE ROW LEVEL SECURITY;

-- 2. Create tenant isolation policy for emergency_beds
DROP POLICY IF EXISTS rls_emergency_beds_tenant_isolation ON emergency_beds;
CREATE POLICY rls_emergency_beds_tenant_isolation ON emergency_beds
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 3. Create tenant isolation policy for pharmacy_sales
DROP POLICY IF EXISTS rls_pharmacy_sales_tenant_isolation ON pharmacy_sales;
CREATE POLICY rls_pharmacy_sales_tenant_isolation ON pharmacy_sales
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 4. Create tenant isolation policy for pharmacy_sale_items
DROP POLICY IF EXISTS rls_pharmacy_sale_items_tenant_isolation ON pharmacy_sale_items;
CREATE POLICY rls_pharmacy_sale_items_tenant_isolation ON pharmacy_sale_items
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
