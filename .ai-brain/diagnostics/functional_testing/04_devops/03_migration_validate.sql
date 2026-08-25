-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_func_tests FROM func_tests;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='func_tests' AND policyname='p_func_tests_tenant';
