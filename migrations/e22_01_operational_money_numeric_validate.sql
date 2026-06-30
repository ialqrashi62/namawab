-- e22_01_operational_money_numeric_validate.sql
-- Validation for e22_01: assert NO targeted operational money column remains a floating type.
-- Returns the count of still-floating columns; expected = 0 after the up-migration.
-- OWNER-RUN ONLY (read-only SELECT, safe to run anytime).

SELECT count(*) AS still_floating_money_columns
FROM information_schema.columns
WHERE table_schema = 'public'
  AND data_type IN ('real', 'double precision')
  AND (table_name, column_name) IN (
        ('invoices','total'), ('invoices','amount'), ('invoices','vat_amount'),
        ('pharmacy_sales','total_amount'), ('pharmacy_sales','discount'),
        ('pharmacy_sales','insurance_coverage'), ('pharmacy_sales','patient_share'),
        ('finance_vouchers','amount'),
        ('hr_salaries','basic'), ('hr_salaries','allowances'), ('hr_salaries','deductions'),
        ('hr_salaries','advances_deducted'), ('hr_salaries','net_salary')
  );
-- PASS criterion: still_floating_money_columns = 0
