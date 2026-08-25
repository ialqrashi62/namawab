-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_endo_visits FROM endo_visits;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='endo_visits' AND policyname='p_endo_visits_tenant';
