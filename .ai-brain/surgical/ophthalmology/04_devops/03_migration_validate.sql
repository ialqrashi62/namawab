-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_eye_visits FROM eye_visits;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='eye_visits' AND policyname='p_eye_visits_tenant';
