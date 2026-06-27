-- ============================================================
-- app_runtime_role_validate.sql  —  READ-ONLY تحقّق بعد إنشاء الدور.
-- ============================================================

-- 1) خصائص الدور: يجب login=t, super=f, bypassrls=f, createdb=f, createrole=f
SELECT 'role_props' AS check,
       rolcanlogin, rolsuper, rolbypassrls, rolcreatedb, rolcreaterole, rolreplication
FROM pg_roles WHERE rolname = 'nama_medical_app';

-- 2) تغطية DML: عدد الجداول التي يملك الدور SELECT عليها مقابل إجمالي الجداول
SELECT 'dml_coverage' AS check,
       (SELECT count(DISTINCT table_name) FROM information_schema.role_table_grants
          WHERE grantee='nama_medical_app' AND privilege_type='SELECT' AND table_schema='public') AS tables_selectable,
       (SELECT count(*) FROM pg_class WHERE relnamespace='public'::regnamespace AND relkind='r') AS tables_total;

-- 3) عدم وجود صلاحيات خطرة: يجب ألا يملك الدور TRUNCATE على أي جدول
SELECT 'dangerous_truncate' AS check, count(*) AS bad
FROM information_schema.role_table_grants
WHERE grantee='nama_medical_app' AND privilege_type='TRUNCATE';

-- 4) سلاسل: عدد السلاسل الممنوحة USAGE
SELECT 'sequence_usage' AS check, count(*) AS seqs
FROM information_schema.role_usage_grants
WHERE grantee='nama_medical_app' AND object_type='SEQUENCE';

-- 5) تأكيد أن الدور ليس عضواً في أي دور superuser/bypassrls
SELECT 'risky_membership' AS check, count(*) AS bad
FROM pg_auth_members am
JOIN pg_roles m ON m.oid=am.member
JOIN pg_roles g ON g.oid=am.roleid
WHERE m.rolname='nama_medical_app' AND (g.rolsuper OR g.rolbypassrls);
