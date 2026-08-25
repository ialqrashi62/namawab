-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_asset_records FROM asset_records;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='asset_records' AND policyname='p_asset_records_tenant';
