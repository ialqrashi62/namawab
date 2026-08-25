-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_nsx_cases FROM nsx_cases;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='nsx_cases' AND policyname='p_nsx_cases_tenant';
