-- 14_table_rls_backfill_candidate_down.sql
-- Reverts the candidate on the 14 PRE-EXISTING tables (does NOT drop the tables). Drops the policy,
-- disables FORCE/RLS, drops the tenant_id DEFAULT, and drops the tenant_id column (which also discards
-- the branches/employees backfilled values — acceptable rollback to the pre-candidate state).
BEGIN;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'discount_rules','finance_cost_centers','finance_fiscal_years','insurance_companies','insurance_contracts',
    'branches','departments','employees','form_templates','cme_activities','cme_registrations',
    'cssd_instrument_sets','cssd_load_items','cssd_sterilization_cycles'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', 'rls_'||t||'_tenant_isolation', t);
    EXECUTE format('ALTER TABLE %I NO FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I ALTER COLUMN tenant_id DROP DEFAULT', t);
    EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS tenant_id', t);
  END LOOP;
END $$;
COMMIT;
