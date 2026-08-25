-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_derm_cases FROM derm_cases;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='derm_cases' AND policyname='p_derm_cases_tenant';
