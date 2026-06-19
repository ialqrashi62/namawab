-- ============================================================================
-- SQL Script: rls_blocker_admissions_transfers_fix_up.sql
-- Description: Targeted fix to enable RLS on Admissions & Transfers
-- Environment: Staging
-- ============================================================================

-- 1. Create index for bed transfers if not exists
CREATE INDEX IF NOT EXISTS idx_bed_transfers_tenant_branch ON bed_transfers (tenant_id, branch_id);

-- 2. Enable and Force RLS on admissions table
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions FORCE ROW LEVEL SECURITY;

-- 3. Enable and Force RLS on bed_transfers table
ALTER TABLE bed_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bed_transfers FORCE ROW LEVEL SECURITY;
