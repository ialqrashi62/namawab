-- Migration: Create surgical checklists, time logs, and urodynamic studies tables with RLS and conditional grants.
BEGIN;

-- 1. Create surgical_checklists table
CREATE TABLE IF NOT EXISTS surgical_checklists (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    surgery_date DATE NOT NULL DEFAULT CURRENT_DATE,
    procedure_name VARCHAR(255) NOT NULL,
    sign_in_confirmed BOOLEAN DEFAULT FALSE,
    time_out_confirmed BOOLEAN DEFAULT FALSE,
    sign_out_confirmed BOOLEAN DEFAULT FALSE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- 2. Create surgical_time_logs table
CREATE TABLE IF NOT EXISTS surgical_time_logs (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    procedure_name VARCHAR(255) NOT NULL,
    anesthesia_start_time TIMESTAMP,
    incision_time TIMESTAMP,
    closure_time TIMESTAMP,
    anesthesia_end_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- 3. Create urodynamic_studies table
CREATE TABLE IF NOT EXISTS urodynamic_studies (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    study_date DATE NOT NULL DEFAULT CURRENT_DATE,
    max_flow_rate NUMERIC(5,2) DEFAULT 0.00,
    voided_volume NUMERIC(5,2) DEFAULT 0.00,
    post_void_residual NUMERIC(5,2) DEFAULT 0.00,
    detrusor_pressure NUMERIC(5,2) DEFAULT 0.00,
    interpretation TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS) on all three tables
ALTER TABLE surgical_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgical_checklists FORCE ROW LEVEL SECURITY;

ALTER TABLE surgical_time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE surgical_time_logs FORCE ROW LEVEL SECURITY;

ALTER TABLE urodynamic_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE urodynamic_studies FORCE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS rls_surgical_checklists_tenant_isolation ON surgical_checklists;
CREATE POLICY rls_surgical_checklists_tenant_isolation ON surgical_checklists
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_surgical_time_logs_tenant_isolation ON surgical_time_logs;
CREATE POLICY rls_surgical_time_logs_tenant_isolation ON surgical_time_logs
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_urodynamic_studies_tenant_isolation ON urodynamic_studies;
CREATE POLICY rls_urodynamic_studies_tenant_isolation ON urodynamic_studies
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_surgical_checklists_patient ON surgical_checklists (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_surgical_time_logs_patient ON surgical_time_logs (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_urodynamic_studies_patient ON urodynamic_studies (tenant_id, patient_id);

-- Grant privileges conditionally
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE surgical_checklists, surgical_time_logs, urodynamic_studies TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE surgical_checklists_id_seq, surgical_time_logs_id_seq, urodynamic_studies_id_seq TO jumanasoft_staging_user';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE surgical_checklists, surgical_time_logs, urodynamic_studies TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE surgical_checklists_id_seq, surgical_time_logs_id_seq, urodynamic_studies_id_seq TO nama_medical_app';
    END IF;
END
$$;

COMMIT;
