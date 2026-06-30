-- Migration: Create CPB logs, pain assessments, and pediatric growth records tables with RLS and grants.
BEGIN;

-- 1. Create cpb_logs table
CREATE TABLE IF NOT EXISTS cpb_logs (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    bypass_date DATE NOT NULL DEFAULT CURRENT_DATE,
    pump_time INTEGER DEFAULT 0,
    cross_clamp_time INTEGER DEFAULT 0,
    flow_rate NUMERIC(4,2) DEFAULT 0.00,
    min_temp NUMERIC(3,1) DEFAULT 37.0,
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- 2. Create pain_assessments table
CREATE TABLE IF NOT EXISTS pain_assessments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    assessment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pain_score_vas INTEGER DEFAULT 0,
    pca_pump_used BOOLEAN DEFAULT FALSE,
    pca_demands INTEGER DEFAULT 0,
    pca_deliveries INTEGER DEFAULT 0,
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- 3. Create pediatric_growth_records table
CREATE TABLE IF NOT EXISTS pediatric_growth_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    apgar_1min INTEGER,
    apgar_5min INTEGER,
    weight_kg NUMERIC(4,2),
    height_cm NUMERIC(4,1),
    head_circ_cm NUMERIC(3,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS) on all three tables
ALTER TABLE cpb_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cpb_logs FORCE ROW LEVEL SECURITY;

ALTER TABLE pain_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pain_assessments FORCE ROW LEVEL SECURITY;

ALTER TABLE pediatric_growth_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pediatric_growth_records FORCE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS rls_cpb_logs_tenant_isolation ON cpb_logs;
CREATE POLICY rls_cpb_logs_tenant_isolation ON cpb_logs
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_pain_assessments_tenant_isolation ON pain_assessments;
CREATE POLICY rls_pain_assessments_tenant_isolation ON pain_assessments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_pediatric_growth_records_tenant_isolation ON pediatric_growth_records;
CREATE POLICY rls_pediatric_growth_records_tenant_isolation ON pediatric_growth_records
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cpb_logs_patient ON cpb_logs (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_pain_assessments_patient ON pain_assessments (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_pediatric_growth_records_patient ON pediatric_growth_records (tenant_id, patient_id);

-- Grant privileges conditionally
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE cpb_logs, pain_assessments, pediatric_growth_records TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE cpb_logs_id_seq, pain_assessments_id_seq, pediatric_growth_records_id_seq TO jumanasoft_staging_user';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE cpb_logs, pain_assessments, pediatric_growth_records TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE cpb_logs_id_seq, pain_assessments_id_seq, pediatric_growth_records_id_seq TO nama_medical_app';
    END IF;
END
$$;

COMMIT;
