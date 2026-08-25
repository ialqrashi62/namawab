-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_incident_records FROM incident_records;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='incident_records' AND policyname='p_incident_records_tenant';
