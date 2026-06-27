-- ============================================================
-- finance_rls_candidate_up.sql
-- CANDIDATE ONLY — DO NOT EXECUTE IN PRODUCTION WITHOUT APPROVAL.
-- يفعّل عزل المستأجر (RLS) على جداول المحاسبة الوعية بالمستأجر، بنفس نمط الـ35 جدولاً القائمة:
--   tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer
-- fail-closed: بلا app.tenant_id => NULL => لا صفوف؛ والإدراج بمستأجر خاطئ يُرفَض (WITH CHECK).
-- ENABLE + FORCE لتطبيقها حتى على مالك الجدول.
-- ملاحظة حاسمة: الـ RLS لا تُنفَّذ على دور superuser/BYPASSRLS — يجب أن يتصل التطبيق بدور غير superuser.
-- الجداول بلا tenant_id (finance_cost_centers, finance_fiscal_years) مؤجَّلة حتى تُضاف tenant_id.
-- ============================================================
BEGIN;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'finance_chart_of_accounts','finance_journal_entries','finance_journal_lines',
    'finance_vouchers','finance_tax_declarations','finance_doctor_commissions','finance_posting_account_map'
  ] LOOP
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
