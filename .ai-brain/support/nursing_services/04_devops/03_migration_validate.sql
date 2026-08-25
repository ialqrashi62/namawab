-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_nursing_records FROM nursing_records;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='nursing_records' AND policyname='p_nursing_records_tenant';
