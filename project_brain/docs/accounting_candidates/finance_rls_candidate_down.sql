-- ============================================================
-- finance_rls_candidate_down.sql
-- CANDIDATE ROLLBACK — يزيل سياسات RLS المالية ويعطّل RLS على الجداول السبعة.
-- لا يحذف بيانات. للإنتاج: التعطيل الفوري يكون عبر هذا أو عبر إيقاف اتصال الدور غير-superuser.
-- ============================================================
BEGIN;
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'finance_chart_of_accounts','finance_journal_entries','finance_journal_lines',
    'finance_vouchers','finance_tax_declarations','finance_doctor_commissions','finance_posting_account_map'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS rls_%s_tenant_isolation ON %I', t, t);
    EXECUTE format('ALTER TABLE %I NO FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;
COMMIT;
