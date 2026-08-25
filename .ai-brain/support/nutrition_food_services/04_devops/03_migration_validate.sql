-- VALIDATE (expect >=0 rows)
SELECT count(*) AS rows_nutrition_orders FROM nutrition_orders;
SELECT count(*) AS missing_policy FROM pg_policies WHERE tablename='nutrition_orders' AND policyname='p_nutrition_orders_tenant';
