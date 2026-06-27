-- ============================================================
-- rls_tenant_id_default_reconciliation_candidate_validate.sql
-- CANDIDATE / READ-ONLY — بعد up. كل bad_rows يجب أن تكون 0.
-- ============================================================

-- 1) كل جداول FORCE-RLS التي لها tenant_id أصبح لها DEFAULT يستخدم current_setting(app.tenant_id)
SELECT 'all_force_rls_tenant_cols_have_default' AS check_name, COUNT(*) AS bad_rows
FROM pg_class c
JOIN pg_namespace n ON n.oid=c.relnamespace
JOIN information_schema.columns col
  ON col.table_schema='public' AND col.table_name=c.relname AND col.column_name='tenant_id'
WHERE n.nspname='public' AND c.relkind='r' AND c.relforcerowsecurity
  AND (col.column_default IS NULL OR col.column_default NOT ILIKE '%current_setting%app.tenant_id%');

-- 2) الـSET DEFAULT لم يعطّل FORCE RLS على أي جدول طُبِّق عليه (env-agnostic)
SELECT 'force_rls_intact_on_defaulted_tables' AS check_name, COUNT(*) AS bad_rows
FROM information_schema.columns col
JOIN pg_class c ON c.relname=col.table_name AND c.relnamespace='public'::regnamespace
WHERE col.table_schema='public' AND col.column_name='tenant_id'
  AND col.column_default ILIKE '%current_setting%app.tenant_id%'
  AND c.relforcerowsecurity = false;

-- 3) لم يُمنح bypassrls/superuser لأي دور تطبيق (لا تغيير أدوار)
SELECT 'app_role_still_unprivileged' AS check_name,
  CASE WHEN EXISTS (SELECT 1 FROM pg_roles WHERE rolname='nama_medical_app' AND rolsuper=false AND rolbypassrls=false) THEN 0 ELSE 1 END AS bad_rows;
