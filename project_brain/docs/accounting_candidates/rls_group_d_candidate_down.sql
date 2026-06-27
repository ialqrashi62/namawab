-- rls_group_d_candidate_down.sql — CANDIDATE ROLLBACK. لا يحذف بيانات.
BEGIN;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['blood_bank_transfusions','blood_bank_crossmatch','package_sessions','approvals'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS rls_%s_tenant_isolation ON %I', t, t);
    EXECUTE format('ALTER TABLE %I NO FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;
COMMIT;
