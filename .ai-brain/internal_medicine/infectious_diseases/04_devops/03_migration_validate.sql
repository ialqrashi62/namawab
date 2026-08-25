-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_id_cases FROM id_cases;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='id_cases' AND policyname='p_id_cases_tenant';
