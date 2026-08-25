-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_cardiology_assessments FROM cardiology_assessments;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='cardiology_assessments' AND policyname='p_cardiology_assessments_tenant';
