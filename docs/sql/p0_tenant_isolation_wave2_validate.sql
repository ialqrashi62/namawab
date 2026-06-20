-- ============================================================================
-- P0 Tenant Isolation — Wave 2 — VALIDATE (read-only)
-- ============================================================================

-- 1) أعمدة tenant_id موجودة لجداول Class A
SELECT table_name, column_name FROM information_schema.columns
WHERE table_schema='public' AND column_name='tenant_id'
  AND table_name IN ('blood_bank_units','blood_bank_donors','blood_bank_crossmatch',
                     'blood_bank_transfusions','approvals','package_sessions')
ORDER BY table_name;
-- المتوقع: 6 صفوف.

-- 2) لا صفوف بـ tenant_id NULL (نجاح backfill)
SELECT 'blood_bank_units' t, COUNT(*) n FROM blood_bank_units WHERE tenant_id IS NULL
UNION ALL SELECT 'blood_bank_transfusions', COUNT(*) FROM blood_bank_transfusions WHERE tenant_id IS NULL
UNION ALL SELECT 'approvals', COUNT(*) FROM approvals WHERE tenant_id IS NULL
UNION ALL SELECT 'package_sessions', COUNT(*) FROM package_sessions WHERE tenant_id IS NULL;
-- المتوقع: n = 0 للجميع.

-- 3) RLS + FORCE RLS مفعّلة
SELECT relname, relrowsecurity AS rls_enabled, relforcerowsecurity AS rls_forced
FROM pg_class
WHERE relname IN ('blood_bank_units','blood_bank_donors','blood_bank_crossmatch',
                  'blood_bank_transfusions','approvals','package_sessions')
ORDER BY relname;
-- المتوقع: t / t للجميع.

-- 4) السياسات موجودة
SELECT tablename, policyname FROM pg_policies
WHERE schemaname='public' AND policyname LIKE 'rls_%_tenant_isolation'
  AND tablename IN ('blood_bank_units','blood_bank_donors','blood_bank_crossmatch',
                    'blood_bank_transfusions','approvals','package_sessions')
ORDER BY tablename;
-- المتوقع: 6 سياسات.
