-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_lab_results FROM lab_results;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='lab_results' AND policyname='p_lab_results_tenant';
