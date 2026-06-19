-- Enable RLS for invoices table on Staging (Batch 2)
-- ============================================================================

-- 1. Enable RLS on invoices table
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- 2. Create permanent-ish policy for invoices table
DROP POLICY IF EXISTS rls_invoices_tenant_isolation ON invoices;
CREATE POLICY rls_invoices_tenant_isolation ON invoices
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
