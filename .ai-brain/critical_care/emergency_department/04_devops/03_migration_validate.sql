-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_er_encounters FROM er_encounters;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='er_encounters' AND policyname='p_er_encounters_tenant';
