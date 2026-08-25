-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_therap_sessions FROM therap_sessions;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='therap_sessions' AND policyname='p_therap_sessions_tenant';
