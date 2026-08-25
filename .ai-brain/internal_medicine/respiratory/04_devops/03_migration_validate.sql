-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_respiratory_visits FROM respiratory_visits;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='respiratory_visits' AND policyname='p_respiratory_visits_tenant';
