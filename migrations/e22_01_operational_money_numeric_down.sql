-- e22_01_operational_money_numeric_down.sql
-- Reverse of e22_01: restore operational money columns to REAL (double precision).
-- NOTE: down-migration is provided for reversibility discipline; reverting NUMERIC->REAL re-introduces
-- floating drift and is NOT recommended except for emergency rollback. OWNER-RUN ONLY.

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
            SELECT table_name, column_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name  = targets[i][1]
              AND column_name = targets[i][2]
              AND data_type = 'numeric'
        LOOP
            EXECUTE format(
                'ALTER TABLE public.%I ALTER COLUMN %I TYPE REAL USING %I::real',
                t.table_name, t.column_name, t.column_name
            );
        END LOOP;
    END LOOP;
END $$;

COMMIT;
