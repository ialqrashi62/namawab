-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_ent_visits FROM ent_visits;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='ent_visits' AND policyname='p_ent_visits_tenant';
