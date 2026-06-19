-- ============================================================================
-- SQL Script: rls_blocker_admissions_transfers_fix_validate.sql
-- Description: Validation query to confirm RLS is active on Admissions & Transfers
-- Environment: Staging
-- ============================================================================

SELECT relname, relrowsecurity, relforcerowsecurity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('admissions', 'bed_transfers');
