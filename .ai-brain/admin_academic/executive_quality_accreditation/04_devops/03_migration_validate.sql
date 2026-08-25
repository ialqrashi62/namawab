-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_quality_records FROM quality_records;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='quality_records' AND policyname='p_quality_records_tenant';
