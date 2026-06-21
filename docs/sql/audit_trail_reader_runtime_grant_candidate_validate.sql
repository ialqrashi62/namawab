-- ============================================================
-- audit_trail_reader_runtime_grant_candidate_validate.sql
-- CANDIDATE / READ-ONLY — يُشغَّل بعد up. كل bad_rows يجب أن تكون 0.
-- ============================================================

-- 1) عضوية nama_medical_app في nama_audit_reader موجودة
SELECT 'membership_exists' AS check_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_auth_members m
    JOIN pg_roles g ON g.oid=m.roleid
    JOIN pg_roles mem ON mem.oid=m.member
    WHERE g.rolname='nama_audit_reader' AND mem.rolname='nama_medical_app'
  ) THEN 0 ELSE 1 END AS bad_rows;

-- 1b) العضوية NON-INHERIT (إلزامي لمنع تطبيق سياسة القارئ على التطبيق دون SET ROLE)
SELECT 'membership_is_noninherit' AS check_name,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_auth_members m
    JOIN pg_roles g ON g.oid=m.roleid
    JOIN pg_roles mem ON mem.oid=m.member
    WHERE g.rolname='nama_audit_reader' AND mem.rolname='nama_medical_app' AND m.inherit_option=false
  ) THEN 0 ELSE 1 END AS bad_rows;

-- 2) دور القارئ ما زال بأقل امتياز (لم يتغيّر بفعل المنح)
SELECT 'reader_still_least_privilege' AS check_name,
  CASE WHEN EXISTS (SELECT 1 FROM pg_roles WHERE rolname='nama_audit_reader'
    AND rolsuper=false AND rolbypassrls=false AND rolcanlogin=false) THEN 0 ELSE 1 END AS bad_rows;

-- 3) دور التطبيق نفسه لم يكتسب super/bypassrls
SELECT 'app_role_unprivileged' AS check_name,
  CASE WHEN EXISTS (SELECT 1 FROM pg_roles WHERE rolname='nama_medical_app'
    AND rolsuper=false AND rolbypassrls=false) THEN 0 ELSE 1 END AS bad_rows;

-- 4) سياسات audit_trail لم تتغيّر (insert_writealways + select_tenant + select_superadmin)
SELECT 'audit_policies_intact' AS check_name,
  CASE WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename='audit_trail'
    AND policyname IN ('audit_trail_insert_writealways','audit_trail_select_tenant','audit_trail_select_superadmin'))=3 THEN 0 ELSE 1 END AS bad_rows;
