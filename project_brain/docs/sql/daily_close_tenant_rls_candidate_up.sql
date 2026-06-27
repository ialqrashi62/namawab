-- daily_close_tenant_rls_candidate_up.sql
-- GATED DDL — NOT EXECUTED. Closes a dormant tenant gap on the finance daily-close table.
-- daily_close holds per-cashier close records (totals/balances); currently 0 rows, no tenant_id, routes lack tenant scope.
-- Empty table => no backfill needed. RLS + DEFAULT auto-cover GET(4470)/POST(4484) without code change.
-- Mirrors the proven 14-table pattern. Run as table owner, atomic.
BEGIN;
ALTER TABLE daily_close ADD COLUMN IF NOT EXISTS tenant_id integer;
ALTER TABLE daily_close ALTER COLUMN tenant_id SET DEFAULT (NULLIF(current_setting('app.tenant_id', true), ''))::integer;
ALTER TABLE daily_close ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_close FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rls_daily_close_tenant_isolation ON daily_close;
CREATE POLICY rls_daily_close_tenant_isolation ON daily_close
  USING (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer)
  WITH CHECK (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer);
COMMIT;
