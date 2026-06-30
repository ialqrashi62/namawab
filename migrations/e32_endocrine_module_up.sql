-- Migration: Create endocrinology and diabetes tables with RLS and conditional grants.
BEGIN;

-- Create diabetes_glucose_logs table
CREATE TABLE IF NOT EXISTS diabetes_glucose_logs (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    glucose_value NUMERIC(5,2) NOT NULL, -- level in mg/dL or mmol/L
    log_type TEXT NOT NULL, -- e.g. 'Fasting', 'Postprandial', 'Random'
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Create insulin_regimens table
CREATE TABLE IF NOT EXISTS insulin_regimens (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    insulin_type TEXT NOT NULL, -- e.g. 'Rapid-acting', 'Long-acting', 'Premixed'
    dosage TEXT NOT NULL, -- e.g. '10 units'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS)
ALTER TABLE diabetes_glucose_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE diabetes_glucose_logs FORCE ROW LEVEL SECURITY;

ALTER TABLE insulin_regimens ENABLE ROW LEVEL SECURITY;
ALTER TABLE insulin_regimens FORCE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS rls_diabetes_glucose_logs_tenant_isolation ON diabetes_glucose_logs;
CREATE POLICY rls_diabetes_glucose_logs_tenant_isolation ON diabetes_glucose_logs
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_insulin_regimens_tenant_isolation ON insulin_regimens;
CREATE POLICY rls_insulin_regimens_tenant_isolation ON insulin_regimens
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_diabetes_glucose_logs_patient ON diabetes_glucose_logs (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_insulin_regimens_patient ON insulin_regimens (tenant_id, patient_id);

-- Grant privileges conditionally
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE diabetes_glucose_logs TO jumanasoft_staging_user';
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE insulin_regimens TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE diabetes_glucose_logs_id_seq TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE insulin_regimens_id_seq TO jumanasoft_staging_user';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE diabetes_glucose_logs TO nama_medical_app';
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE insulin_regimens TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE diabetes_glucose_logs_id_seq TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE insulin_regimens_id_seq TO nama_medical_app';
    END IF;
END
$$;

COMMIT;
