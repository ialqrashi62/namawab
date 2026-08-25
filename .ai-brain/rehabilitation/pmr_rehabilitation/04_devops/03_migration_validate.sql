-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_rehab_sessions FROM rehab_sessions;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='rehab_sessions' AND policyname='p_rehab_sessions_tenant';
