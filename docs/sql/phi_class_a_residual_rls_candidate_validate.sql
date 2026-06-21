-- ============================================================
-- phi_class_a_residual_rls_candidate_validate.sql
-- CANDIDATE / READ-ONLY — لا يعدّل بيانات. يُشغَّل بعد up للتأكد.
-- ============================================================

-- 1) كل الجداول الخمسة أصبحت FORCE RLS مع سياسة عزل
SELECT 'rls_forced_with_policy' AS check_name, COUNT(*) AS bad_rows
FROM (VALUES ('portal_users'),('audit_trail'),('packages'),('blood_bank_donors'),('blood_bank_units')) v(t)
WHERE NOT (
  (SELECT relforcerowsecurity FROM pg_class WHERE relname=v.t AND relnamespace='public'::regnamespace)
  AND EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=v.t)
);

-- 2) عمود tenant_id موجود على الجداول الخمسة
SELECT 'tenant_id_present' AS check_name, COUNT(*) AS bad_rows
FROM (VALUES ('portal_users'),('audit_trail'),('packages'),('blood_bank_donors'),('blood_bank_units')) v(t)
WHERE NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name=v.t AND column_name='tenant_id');

-- 3) لا صفوف بـ tenant_id = NULL (لمنع إخفاء بيانات بعد التحويل لدور غير-superuser)
SELECT 'portal_users_null_tenant'  AS check_name, COUNT(*) AS bad_rows FROM portal_users  WHERE tenant_id IS NULL;
SELECT 'audit_trail_null_tenant'   AS check_name, COUNT(*) AS bad_rows FROM audit_trail   WHERE tenant_id IS NULL;
SELECT 'packages_null_tenant'      AS check_name, COUNT(*) AS bad_rows FROM packages      WHERE tenant_id IS NULL;
SELECT 'blood_bank_donors_null'    AS check_name, COUNT(*) AS bad_rows FROM blood_bank_donors WHERE tenant_id IS NULL;
SELECT 'blood_bank_units_null'     AS check_name, COUNT(*) AS bad_rows FROM blood_bank_units  WHERE tenant_id IS NULL;
