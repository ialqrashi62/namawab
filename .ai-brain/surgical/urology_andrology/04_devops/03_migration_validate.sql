-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_urou_cases FROM urou_cases;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='urou_cases' AND policyname='p_urou_cases_tenant';
