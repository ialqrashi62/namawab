-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_ortho_cases FROM ortho_cases;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='ortho_cases' AND policyname='p_ortho_cases_tenant';
