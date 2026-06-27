-- ============================================================
-- rls_tenant_id_default_reconciliation_candidate_up.sql
-- CANDIDATE ONLY — DO NOT EXECUTE ON PRODUCTION WITHOUT EXPLICIT APPROVAL.
--
-- المشكلة (مؤكَّدة): بعد تبديل الدور إلى nama_medical_app (RLS مُنفَّذ)، ~44 جدول FORCE-RLS
--   له مسار INSERT في الكود المنشور (039a7d7) لا يختم tenant_id، ولا يوجد DEFAULT على العمود
--   ⇒ INSERT بلا tenant_id يفشل 42501 (أُثبت تجريبياً على transport_requests). انحدار كتابة واسع.
--
-- الحل الشامل (آمن، بلا تعديل ~44 مسار كود): ضبط DEFAULT لعمود tenant_id على كل جداول
--   FORCE-RLS بحيث يأخذ قيمة app.tenant_id للجلسة تلقائياً عند الإدراج دون تمريره.
--   * لا يضعف العزل: سياسة WITH CHECK تبقى (tenant_id = app.tenant_id)؛ الـDEFAULT يوفّر نفس
--     القيمة التي كان الكود سيختمها، فلا يمكن تزوير مستأجر آخر (تمرير tenant_id صريح يتجاوز الـDEFAULT
--     لكن WITH CHECK يمنع قيمة مخالفة للسياق).
--   * بلا سياق (postgres/غير مصادق) ⇒ DEFAULT=NULL (نفس السلوك الحالي).
--   * يصلح أيضاً إسناد tenant لـ audit_trail (يسدّ فجوة logAudit بلا تعديل كود).
-- idempotent: SET DEFAULT يُعاد ضبطه لنفس القيمة بأمان.
-- ============================================================
BEGIN;
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT c.relname AS t
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname='public' AND c.relkind='r' AND c.relforcerowsecurity
      AND EXISTS (
        SELECT 1 FROM information_schema.columns col
        WHERE col.table_schema='public' AND col.table_name=c.relname AND col.column_name='tenant_id'
      )
  LOOP
    EXECUTE format(
      'ALTER TABLE public.%I ALTER COLUMN tenant_id SET DEFAULT (NULLIF(current_setting(''app.tenant_id'', true), ''''))::integer',
      r.t
    );
  END LOOP;
END $$;
COMMIT;
