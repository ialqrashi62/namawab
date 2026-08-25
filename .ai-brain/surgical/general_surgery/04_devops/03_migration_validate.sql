-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_surg_or_cases FROM surg_or_cases;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='surg_or_cases' AND policyname='p_surg_or_cases_tenant';
