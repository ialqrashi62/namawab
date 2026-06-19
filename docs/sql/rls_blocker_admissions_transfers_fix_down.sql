-- ============================================================================
-- SQL Script: rls_blocker_admissions_transfers_fix_down.sql
-- Description: Targeted rollback to disable RLS on Admissions & Transfers
-- Environment: Staging
-- ============================================================================

-- 1. Disable RLS on admissions
ALTER TABLE admissions DISABLE ROW LEVEL SECURITY;

-- 2. Disable RLS on bed_transfers
ALTER TABLE bed_transfers DISABLE ROW LEVEL SECURITY;

-- 3. Drop index
DROP INDEX IF EXISTS idx_bed_transfers_tenant_branch;
