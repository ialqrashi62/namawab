-- 14_table_rls_backfill_candidate_up.sql
-- CANDIDATE for controlled prod execution (SUPERUSER, atomic). Closes the 14 tenant-sensitive tables
-- that lack DB-level RLS (per PHASE 3 audit). Adds tenant_id + DEFAULT + ENABLE/FORCE RLS + tenant policy,
-- matching the patients pattern. Backfill ONLY the 2 tables with existing rows (branches=1, employees=3)
-- to tenant_id=1 (provable single-tenant: tenant 2 has zero data/users; branches.facility_id=1 is tenant 1).
-- The other 12 tables are empty. NO seed, NO delete, NO business-data change, NO GRANT, NO role change.
BEGIN;

-- 1) Add tenant_id column to all 14 (idempotent)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'discount_rules','finance_cost_centers','finance_fiscal_years','insurance_companies','insurance_contracts',
    'branches','departments','employees','form_templates','cme_activities','cme_registrations',
    'cssd_instrument_sets','cssd_load_items','cssd_sterilization_cycles'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS tenant_id INTEGER', t);
  END LOOP;
END $$;

-- 2) Backfill ONLY the 2 tables that hold rows (single-tenant data => tenant 1). 12 empty tables untouched.
UPDATE branches  SET tenant_id = 1 WHERE tenant_id IS NULL;   -- 1 row (Main Branch, facility_id=1)
UPDATE employees SET tenant_id = 1 WHERE tenant_id IS NULL;   -- 3 rows (sole operating tenant)

-- 3) DEFAULT + ENABLE/FORCE RLS + tenant-isolation policy for all 14
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'discount_rules','finance_cost_centers','finance_fiscal_years','insurance_companies','insurance_contracts',
    'branches','departments','employees','form_templates','cme_activities','cme_registrations',
    'cssd_instrument_sets','cssd_load_items','cssd_sterilization_cycles'
  ] LOOP
    EXECUTE format('ALTER TABLE %I ALTER COLUMN tenant_id SET DEFAULT (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer', t);
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = t AND policyname = 'rls_'||t||'_tenant_isolation') THEN
      EXECUTE format('CREATE POLICY %I ON %I FOR ALL USING (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer) WITH CHECK (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer)', 'rls_'||t||'_tenant_isolation', t);
    END IF;
  END LOOP;
END $$;

COMMIT;
