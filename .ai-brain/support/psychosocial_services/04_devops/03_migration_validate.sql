-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_social_cases FROM social_cases;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='social_cases' AND policyname='p_social_cases_tenant';
