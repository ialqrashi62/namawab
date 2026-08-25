-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_peds_visits FROM peds_visits;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='peds_visits' AND policyname='p_peds_visits_tenant';
