-- Validation: Verify that all required columns exist on patients.
DO $$
DECLARE
    col RECORD;
    required_cols TEXT[] := ARRAY['mrn', 'allergies', 'chronic_diseases', 'emergency_contact_name', 'emergency_contact_phone', 'address', 'insurance_company', 'insurance_policy_number', 'insurance_class'];
    c TEXT;
BEGIN
    FOREACH c IN ARRAY required_cols LOOP
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'patients' 
              AND column_name = c
        ) THEN
            RAISE EXCEPTION 'Validation failed: Column % does not exist on patients table', c;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Validation passed: All required columns exist on patients table';
END $$;
