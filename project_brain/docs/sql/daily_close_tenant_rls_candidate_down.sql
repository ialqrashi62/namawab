-- daily_close_tenant_rls_candidate_down.sql  (rollback)
BEGIN;
DROP POLICY IF EXISTS rls_daily_close_tenant_isolation ON daily_close;
ALTER TABLE daily_close NO FORCE ROW LEVEL SECURITY;
ALTER TABLE daily_close DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_close ALTER COLUMN tenant_id DROP DEFAULT;
-- column kept (harmless, nullable); to fully revert: ALTER TABLE daily_close DROP COLUMN tenant_id;
COMMIT;
