-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_oncology_cycles FROM oncology_cycles;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='oncology_cycles' AND policyname='p_oncology_cycles_tenant';
