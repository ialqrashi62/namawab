-- ============================================================
-- audit_trail_super_admin_view_candidate_validate.sql
-- CANDIDATE / READ-ONLY — يُشغَّل بعد up. كل bad_rows يجب أن تكون 0.
-- ============================================================

-- 1) الدور موجود وبأقل امتياز (NOLOGIN/NOSUPERUSER/NOBYPASSRLS)
SELECT 'reader_role_least_privilege' AS check_name,
  CASE WHEN EXISTS (SELECT 1 FROM pg_roles WHERE rolname='nama_audit_reader'
    AND rolsuper=false AND rolbypassrls=false AND rolcanlogin=false) THEN 0 ELSE 1 END AS bad_rows;

-- 2) للدور صلاحية SELECT على audit_trail
SELECT 'reader_has_select' AS check_name,
  CASE WHEN has_table_privilege('nama_audit_reader','public.audit_trail','SELECT') THEN 0 ELSE 1 END AS bad_rows;

-- 3) ليس للدور INSERT/UPDATE/DELETE على audit_trail (قراءة فقط)
SELECT 'reader_no_write' AS check_name,
  CASE WHEN has_table_privilege('nama_audit_reader','public.audit_trail','INSERT')
        OR has_table_privilege('nama_audit_reader','public.audit_trail','UPDATE')
        OR has_table_privilege('nama_audit_reader','public.audit_trail','DELETE') THEN 1 ELSE 0 END AS bad_rows;

-- 4) السياسة السماحية موجودة، FOR SELECT، ومقيّدة بالدور nama_audit_reader فقط
SELECT 'superadmin_policy_scoped' AS check_name,
  CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename='audit_trail'
    AND policyname='audit_trail_select_superadmin' AND cmd='SELECT'
    AND roles = ARRAY['nama_audit_reader']::name[]) THEN 0 ELSE 1 END AS bad_rows;

-- 5) سياسة عزل المستأجر القائمة لم تُمَس (لا إضعاف للعزل العام)
SELECT 'tenant_select_policy_intact' AS check_name,
  CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename='audit_trail'
    AND policyname='audit_trail_select_tenant' AND cmd='SELECT') THEN 0 ELSE 1 END AS bad_rows;

-- 6) FORCE RLS ما زالت مفعّلة على audit_trail
SELECT 'force_rls_still_on' AS check_name,
  CASE WHEN (SELECT relforcerowsecurity FROM pg_class
    WHERE relname='audit_trail' AND relnamespace='public'::regnamespace) THEN 0 ELSE 1 END AS bad_rows;

-- 7) الدور لا يملك صلاحيات على جداول حسّاسة أخرى (تأكيد عدم تسرّب الامتياز) — مثال: patients
SELECT 'reader_no_other_table_access' AS check_name,
  CASE WHEN has_table_privilege('nama_audit_reader','public.patients','SELECT') THEN 1 ELSE 0 END AS bad_rows;
