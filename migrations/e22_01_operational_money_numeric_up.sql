-- e22_01_operational_money_numeric_up.sql
-- REMEDIATION (GATE4-M1): convert operational money columns from REAL (floating point) to NUMERIC(14,2).
-- Context: the GL (finance_journal_lines) and insurance_claims were already migrated to NUMERIC, but
-- operational money columns (invoices, pharmacy_sales, finance_vouchers, hr_salaries) remained REAL,
-- which causes rounding drift on SUM()/aggregation in financial reports.
-- SAFETY: idempotent + defensive — only alters a column that (a) exists and (b) is still a floating type.
-- Values are ROUND()ed to 2dp during the cast (no silent truncation). Wrapped in a single transaction.
-- OWNER-RUN ONLY. Verify against production schema before executing.

BEGIN;

DO $$
DECLARE
    t record;
    targets text[][] := ARRAY[
        ['invoices','total'], ['invoices','amount'], ['invoices','vat_amount'],
        ['pharmacy_sales','total_amount'], ['pharmacy_sales','discount'],
        ['pharmacy_sales','insurance_coverage'], ['pharmacy_sales','patient_share'],
        ['finance_vouchers','amount'],
        ['hr_salaries','basic'], ['hr_salaries','allowances'], ['hr_salaries','deductions'],
        ['hr_salaries','advances_deducted'], ['hr_salaries','net_salary']
    ];
    i int;
BEGIN
    FOR i IN 1 .. array_length(targets, 1) LOOP
        FOR t IN
            SELECT table_name, column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name  = targets[i][1]
              AND column_name = targets[i][2]
              AND data_type IN ('real', 'double precision')
        LOOP
            EXECUTE format(
                'ALTER TABLE public.%I ALTER COLUMN %I TYPE NUMERIC(14,2) USING ROUND(%I::numeric, 2)',
                t.table_name, t.column_name, t.column_name
            );
            RAISE NOTICE 'Converted %.% -> NUMERIC(14,2)', t.table_name, t.column_name;
        END LOOP;
    END LOOP;
END $$;

COMMIT;
