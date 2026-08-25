-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_integrative_sessions FROM integrative_sessions;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='integrative_sessions' AND policyname='p_integrative_sessions_tenant';
