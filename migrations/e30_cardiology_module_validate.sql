-- Validation: Verify that cardiology tables exist and RLS is enabled.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'cardiology_procedures'
    ) THEN
        RAISE EXCEPTION 'Validation failed: table cardiology_procedures does not exist';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_name = 'ecg_records'
    ) THEN
        RAISE EXCEPTION 'Validation failed: table ecg_records does not exist';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'cardiology_procedures' 
          AND policyname = 'rls_cardiology_procedures_tenant_isolation'
    ) THEN
        RAISE EXCEPTION 'Validation failed: rls_cardiology_procedures_tenant_isolation policy does not exist';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'ecg_records' 
          AND policyname = 'rls_ecg_records_tenant_isolation'
    ) THEN
        RAISE EXCEPTION 'Validation failed: rls_ecg_records_tenant_isolation policy does not exist';
    END IF;
    
    RAISE NOTICE 'Validation passed: Cardiology module tables and RLS are fully set up';
END $$;
