-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_ctsx_cases FROM ctsx_cases;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='ctsx_cases' AND policyname='p_ctsx_cases_tenant';
