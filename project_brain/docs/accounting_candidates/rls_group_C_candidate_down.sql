-- rls_group_C_candidate_down.sql — CANDIDATE ROLLBACK. لا يحذف بيانات.
BEGIN;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'company_settings','integration_settings','tenant_settings','facilities','pharmacy_drug_catalog','queue_advertisements'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS rls_%s_tenant_isolation ON %I', t, t);
    EXECUTE format('ALTER TABLE %I NO FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;
COMMIT;
