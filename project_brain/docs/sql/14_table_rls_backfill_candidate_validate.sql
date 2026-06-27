-- 14_table_rls_backfill_candidate_validate.sql  (run AFTER up.sql; read-only)
-- PASS = all 14 have tenant_id + FORCE RLS + policy + DEFAULT; branches/employees rows tenant_id=1 (no nulls);
-- row counts preserved (branches=1, employees=3); app role unchanged.
WITH t14 AS (SELECT unnest(ARRAY[
  'discount_rules','finance_cost_centers','finance_fiscal_years','insurance_companies','insurance_contracts',
  'branches','departments','employees','form_templates','cme_activities','cme_registrations',
  'cssd_instrument_sets','cssd_load_items','cssd_sterilization_cycles']) AS tbl)
SELECT
  (SELECT count(*) FROM t14 JOIN information_schema.columns c ON c.table_name=t14.tbl AND c.column_name='tenant_id') AS have_tenant_id_of_14,
  (SELECT count(*) FROM t14 JOIN pg_class pc ON pc.relname=t14.tbl WHERE pc.relforcerowsecurity) AS force_rls_of_14,
  (SELECT count(*) FROM t14 JOIN pg_policies p ON p.tablename=t14.tbl AND p.policyname='rls_'||t14.tbl||'_tenant_isolation') AS policies_of_14,
  (SELECT count(*) FROM t14 JOIN information_schema.columns c ON c.table_name=t14.tbl AND c.column_name='tenant_id' AND c.column_default LIKE '%app.tenant_id%') AS defaults_of_14;
-- expect all four = 14
SELECT 'branches' tbl, count(*)::int rows, count(*) FILTER (WHERE tenant_id IS NULL)::int null_tenant, count(*) FILTER (WHERE tenant_id=1)::int tenant1 FROM branches
UNION ALL SELECT 'employees', count(*)::int, count(*) FILTER (WHERE tenant_id IS NULL)::int, count(*) FILTER (WHERE tenant_id=1)::int FROM employees;
-- expect branches rows=1 null=0 tenant1=1 ; employees rows=3 null=0 tenant1=3
SELECT rolname, rolsuper, rolbypassrls FROM pg_roles WHERE rolname='nama_medical_app';  -- expect false/false
SELECT count(*)::int AS total_force_rls FROM pg_class WHERE relforcerowsecurity AND relkind='r';  -- expect 147 (was 133)
