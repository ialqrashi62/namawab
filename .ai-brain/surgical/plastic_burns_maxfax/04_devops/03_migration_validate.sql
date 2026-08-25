-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_plast_cases FROM plast_cases;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='plast_cases' AND policyname='p_plast_cases_tenant';
