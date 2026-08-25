-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_gastro_procedures FROM gastro_procedures;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='gastro_procedures' AND policyname='p_gastro_procedures_tenant';
