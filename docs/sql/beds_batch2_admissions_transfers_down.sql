-- ============================================================================
-- SQL Script: beds_batch2_admissions_transfers_down.sql
-- Description: Disable RLS and Drop Isolation Policies for Admissions & Bed Transfers
-- Environment: Staging
-- ============================================================================

-- 1. Disable RLS on admissions Table
ALTER TABLE admissions DISABLE ROW LEVEL SECURITY;

-- 2. Drop Tenant Isolation Policy for admissions
DROP POLICY IF EXISTS rls_admissions_tenant_isolation ON admissions;

-- 3. Disable RLS on bed_transfers Table
ALTER TABLE bed_transfers DISABLE ROW LEVEL SECURITY;

-- 4. Drop Tenant Isolation Policy for bed_transfers
DROP POLICY IF EXISTS rls_bed_transfers_tenant_isolation ON bed_transfers;

-- 5. Drop Index for Bed Transfers
DROP INDEX IF EXISTS idx_bed_transfers_tenant_branch;
