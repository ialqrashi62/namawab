-- rls_group_d_candidate_up.sql — RLS للجداول الآمنة الأربعة فقط (بعد إضافة tenant_id).
-- نمط مُثبت: tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer ، ENABLE+FORCE، fail-closed.
-- لا يُطبَّق إلا بعد backfill ناجح (validate = 0 unbackfilled/mismatch).
BEGIN;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['blood_bank_transfusions','blood_bank_crossmatch','package_sessions','approvals'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS rls_%s_tenant_isolation ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY rls_%s_tenant_isolation ON %I FOR ALL '
      || 'USING (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer) '
      || 'WITH CHECK (tenant_id = (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer)',
      t, t);
  END LOOP;
END $$;
COMMIT;
