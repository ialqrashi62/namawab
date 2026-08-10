-- Migration: Create/upgrade nephrology and dialysis session tables with RLS and conditional grants.
BEGIN;

-- Create dialysis_sessions table if it does not exist
CREATE TABLE IF NOT EXISTS dialysis_sessions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    dialysis_type VARCHAR(50) NOT NULL DEFAULT 'Hemodialysis',
    duration_hours NUMERIC(4,2),
    ultrafiltration_target_liters NUMERIC(4,2),
    blood_flow_rate_ml_min INTEGER,
    dialysate_flow_rate_ml_min INTEGER,
    pre_weight_kg NUMERIC(5,2),
    post_weight_kg NUMERIC(5,2),
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Upgrade existing table if it already existed with older schema
ALTER TABLE dialysis_sessions ADD COLUMN IF NOT EXISTS dialysis_type VARCHAR(50) NOT NULL DEFAULT 'Hemodialysis';
ALTER TABLE dialysis_sessions ADD COLUMN IF NOT EXISTS ultrafiltration_target_liters NUMERIC(4,2);
ALTER TABLE dialysis_sessions ADD COLUMN IF NOT EXISTS blood_flow_rate_ml_min INTEGER;
ALTER TABLE dialysis_sessions ADD COLUMN IF NOT EXISTS dialysate_flow_rate_ml_min INTEGER;
ALTER TABLE dialysis_sessions ADD COLUMN IF NOT EXISTS pre_weight_kg NUMERIC(5,2);
ALTER TABLE dialysis_sessions ADD COLUMN IF NOT EXISTS post_weight_kg NUMERIC(5,2);

-- Copy legacy data to new columns for compatibility
UPDATE dialysis_sessions SET pre_weight_kg = weight_pre WHERE pre_weight_kg IS NULL AND weight_pre IS NOT NULL;
UPDATE dialysis_sessions SET post_weight_kg = weight_post WHERE post_weight_kg IS NULL AND weight_post IS NOT NULL;
UPDATE dialysis_sessions SET ultrafiltration_target_liters = ultrafiltration_volume WHERE ultrafiltration_target_liters IS NULL AND ultrafiltration_volume IS NOT NULL;
UPDATE dialysis_sessions SET blood_flow_rate_ml_min = blood_flow_rate WHERE blood_flow_rate_ml_min IS NULL AND blood_flow_rate IS NOT NULL;

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
