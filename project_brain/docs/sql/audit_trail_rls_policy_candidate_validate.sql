-- ============================================================
-- audit_trail_rls_policy_candidate_validate.sql
-- CANDIDATE / READ-ONLY — يُشغَّل بعد up للتأكد. كل bad_rows يجب أن تكون 0.
-- ============================================================

-- 1) السياسة الصارمة القديمة أُزيلت
SELECT 'old_strict_policy_removed' AS check_name, COUNT(*) AS bad_rows
FROM pg_policies WHERE schemaname='public' AND tablename='audit_trail'
  AND policyname='rls_audit_trail_tenant_isolation';

-- 2) سياسة الإدراج (write-always) موجودة ومقيّدة بـ INSERT
SELECT 'insert_writealways_present' AS check_name,
  CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename='audit_trail'
    AND policyname='audit_trail_insert_writealways' AND cmd='INSERT') THEN 0 ELSE 1 END AS bad_rows;

-- 3) سياسة القراءة (tenant isolation) موجودة ومقيّدة بـ SELECT
SELECT 'select_tenant_present' AS check_name,
  CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename='audit_trail'
    AND policyname='audit_trail_select_tenant' AND cmd='SELECT') THEN 0 ELSE 1 END AS bad_rows;

-- 4) لا سياسة UPDATE/DELETE (append-only)
SELECT 'no_update_delete_policy' AS check_name, COUNT(*) AS bad_rows
FROM pg_policies WHERE schemaname='public' AND tablename='audit_trail' AND cmd IN ('UPDATE','DELETE');

-- 5) FORCE RLS ما زالت مفعّلة (لم نُضعِف العزل)
SELECT 'force_rls_still_on' AS check_name,
  CASE WHEN (SELECT relforcerowsecurity FROM pg_class
    WHERE relname='audit_trail' AND relnamespace='public'::regnamespace) THEN 0 ELSE 1 END AS bad_rows;

-- 6) إجمالي سياسات audit_trail = 2 بالضبط (insert + select)
SELECT 'exactly_two_policies' AS check_name,
  CASE WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename='audit_trail')=2 THEN 0 ELSE 1 END AS bad_rows;
