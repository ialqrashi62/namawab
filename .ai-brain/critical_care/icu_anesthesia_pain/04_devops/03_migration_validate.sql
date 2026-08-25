-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_icu_flowsheets FROM icu_flowsheets;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='icu_flowsheets' AND policyname='p_icu_flowsheets_tenant';
