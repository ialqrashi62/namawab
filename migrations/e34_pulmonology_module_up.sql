-- Migration: Create pulmonology and PFT tables with RLS and conditional grants.
BEGIN;

-- Create pulmonary_function_tests table
CREATE TABLE IF NOT EXISTS pulmonary_function_tests (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    test_date DATE NOT NULL DEFAULT CURRENT_DATE,
    fev1 NUMERIC(4,2), -- in liters
    fvc NUMERIC(4,2), -- in liters
    fev1_fvc_ratio NUMERIC(5,2), -- in %
    pef NUMERIC(5,1), -- in L/min
    interpretation TEXT DEFAULT '', -- Normal, Obstructive, Restrictive, Mixed
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS)
ALTER TABLE pulmonary_function_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulmonary_function_tests FORCE ROW LEVEL SECURITY;

-- Create RLS policy
DROP POLICY IF EXISTS rls_pulmonary_function_tests_tenant_isolation ON pulmonary_function_tests;
CREATE POLICY rls_pulmonary_function_tests_tenant_isolation ON pulmonary_function_tests
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create index
CREATE INDEX IF NOT EXISTS idx_pulmonary_function_tests_patient ON pulmonary_function_tests (tenant_id, patient_id);

-- Grant privileges conditionally
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE pulmonary_function_tests TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE pulmonary_function_tests_id_seq TO jumanasoft_staging_user';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE pulmonary_function_tests TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE pulmonary_function_tests_id_seq TO nama_medical_app';
    END IF;
END
$$;

COMMIT;
