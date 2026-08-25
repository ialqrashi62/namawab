-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_hr_records FROM hr_records;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='hr_records' AND policyname='p_hr_records_tenant';
