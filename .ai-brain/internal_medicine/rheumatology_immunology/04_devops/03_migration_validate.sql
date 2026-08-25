-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_rheum_visits FROM rheum_visits;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='rheum_visits' AND policyname='p_rheum_visits_tenant';
