-- ============================================================
-- rls_tenant_id_default_reconciliation_candidate_down.sql
-- CANDIDATE ROLLBACK — DO NOT EXECUTE WITHOUT APPROVAL.
-- يزيل DEFAULT الذي أضافه up عن tenant_id في جداول FORCE-RLS (يعيد لا-DEFAULT).
-- آمن: لا يمسّ السياسات ولا FORCE RLS ولا البيانات. idempotent.
-- ملاحظة: بعد التراجع تعود مسارات الإدراج غير المختومة إلى الفشل 42501 — لا تتراجع إلا
--   بعد إعادة نشر كود يختم tenant_id لتلك المسارات.
-- ============================================================
BEGIN;
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT c.relname AS t
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN information_schema.columns col
      ON col.table_schema='public' AND col.table_name=c.relname AND col.column_name='tenant_id'
    WHERE n.nspname='public' AND c.relkind='r' AND c.relforcerowsecurity
      AND col.column_default ILIKE '%current_setting%app.tenant_id%'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ALTER COLUMN tenant_id DROP DEFAULT', r.t);
  END LOOP;
END $$;
COMMIT;
