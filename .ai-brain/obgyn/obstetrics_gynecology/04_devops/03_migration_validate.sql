-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_obgyn_encounters FROM obgyn_encounters;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='obgyn_encounters' AND policyname='p_obgyn_encounters_tenant';
