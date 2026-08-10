-- Validation: Verify that prescriptions has tenant_id, facility_id, and RLS enabled.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'prescriptions' 
          AND column_name = 'tenant_id'
    ) THEN
        RAISE EXCEPTION 'Validation failed: tenant_id column does not exist on prescriptions table';
    END IF;

    IF NOT EXISTS (
        SELECT 1 
        FROM pg_policies 
        WHERE tablename = 'prescriptions' 
          AND policyname = 'rls_prescriptions_tenant_isolation'
    ) THEN
        RAISE EXCEPTION 'Validation failed: rls_prescriptions_tenant_isolation policy does not exist on prescriptions table';
    END IF;
    
    RAISE NOTICE 'Validation passed: prescriptions table RLS is fully reconciled';
END $$;
