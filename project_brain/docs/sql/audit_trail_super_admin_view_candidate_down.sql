-- ============================================================
-- audit_trail_super_admin_view_candidate_down.sql
-- CANDIDATE ROLLBACK — DO NOT EXECUTE WITHOUT APPROVAL.
-- يتراجع عن up: يُسقط السياسة السماحية + صلاحيات الدور + الدور نفسه. آمن، idempotent.
-- لا يمسّ audit_trail_select_tenant ولا audit_trail_insert_writealways ولا FORCE RLS.
-- ملاحظة: إن كان المالك قد فعّل الخيار B (GRANT nama_audit_reader TO nama_medical_app)،
--   فنفّذ أولاً خارج هذا الملف: REVOKE nama_audit_reader FROM nama_medical_app;
-- ============================================================
BEGIN;

DROP POLICY IF EXISTS audit_trail_select_superadmin ON audit_trail;

-- سحب الصلاحيات قبل إسقاط الدور (وإلا يفشل DROP ROLE لوجود تبعيات)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='nama_audit_reader') THEN
    EXECUTE 'REVOKE SELECT ON audit_trail FROM nama_audit_reader';
    EXECUTE 'REVOKE USAGE ON SCHEMA public FROM nama_audit_reader';
  END IF;
END $$;

DROP ROLE IF EXISTS nama_audit_reader;

COMMIT;
