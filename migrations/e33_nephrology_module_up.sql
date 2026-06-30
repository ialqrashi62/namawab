-- Migration: Create nephrology and dialysis tables with RLS and conditional grants.
BEGIN;

-- Create dialysis_sessions table
CREATE TABLE IF NOT EXISTS dialysis_sessions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_pre NUMERIC(5,2), -- in kg
    weight_post NUMERIC(5,2), -- in kg
    blood_flow_rate INTEGER, -- in mL/min
    ultrafiltration_volume NUMERIC(4,2), -- in L
    duration_hours NUMERIC(3,1), -- in hours
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS)
ALTER TABLE dialysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dialysis_sessions FORCE ROW LEVEL SECURITY;

-- Create RLS policy
DROP POLICY IF EXISTS rls_dialysis_sessions_tenant_isolation ON dialysis_sessions;
CREATE POLICY rls_dialysis_sessions_tenant_isolation ON dialysis_sessions
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create index
CREATE INDEX IF NOT EXISTS idx_dialysis_sessions_patient ON dialysis_sessions (tenant_id, patient_id);

-- Grant privileges conditionally
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE dialysis_sessions TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE dialysis_sessions_id_seq TO jumanasoft_staging_user';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE dialysis_sessions TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE dialysis_sessions_id_seq TO nama_medical_app';
    END IF;
END
$$;

COMMIT;
