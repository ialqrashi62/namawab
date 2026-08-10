-- Validation: Verify that payment_gateway_ref column exists on invoices table.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'invoices' 
          AND column_name = 'payment_gateway_ref'
    ) THEN
        RAISE EXCEPTION 'Validation failed: payment_gateway_ref column does not exist on invoices table';
    END IF;
    
    RAISE NOTICE 'Validation passed: payment_gateway_ref column exists on invoices table';
END $$;
