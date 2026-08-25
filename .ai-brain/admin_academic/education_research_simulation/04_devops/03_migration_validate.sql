-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_research_records FROM research_records;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='research_records' AND policyname='p_research_records_tenant';
