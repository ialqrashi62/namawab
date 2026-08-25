-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_rad_orders FROM rad_orders;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='rad_orders' AND policyname='p_rad_orders_tenant';
