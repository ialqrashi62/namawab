-- rls_group_C_candidate_validate.sql — READ-ONLY. متوقّع enabled=6, policies=6.
SELECT 'groupC_rls_enabled' AS check, count(*) AS n FROM pg_class
WHERE relnamespace='public'::regnamespace AND relkind='r' AND relrowsecurity AND relforcerowsecurity
AND relname IN ('company_settings','integration_settings','tenant_settings','facilities','pharmacy_drug_catalog','queue_advertisements');
SELECT 'groupC_policies' AS check, count(*) AS n FROM pg_policies
WHERE policyname LIKE 'rls_%_tenant_isolation' AND tablename IN ('company_settings','integration_settings','tenant_settings','facilities','pharmacy_drug_catalog','queue_advertisements');
-- تحقق منطق global-aware (بعد بذر بيانات اختبار): المستأجر يرى صفّه + العالمي، لا صفوف مستأجر آخر.
