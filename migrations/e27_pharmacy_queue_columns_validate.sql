-- Validation: Verify that all required columns exist on pharmacy_prescriptions_queue.
DO $$
DECLARE
    col RECORD;
    required_cols TEXT[] := ARRAY['medication_name', 'dosage', 'quantity_per_day', 'frequency', 'duration', 'price', 'payment_method', 'tenant_id', 'branch_id'];
    c TEXT;
BEGIN
    FOREACH c IN ARRAY required_cols LOOP
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'pharmacy_prescriptions_queue' 
              AND column_name = c
        ) THEN
            RAISE EXCEPTION 'Validation failed: Column % does not exist on pharmacy_prescriptions_queue table', c;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Validation passed: All required columns exist on pharmacy_prescriptions_queue table';
END $$;
