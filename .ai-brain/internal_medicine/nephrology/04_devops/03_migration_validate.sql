-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_nephrology_sessions FROM nephrology_sessions;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='nephrology_sessions' AND policyname='p_nephrology_sessions_tenant';
