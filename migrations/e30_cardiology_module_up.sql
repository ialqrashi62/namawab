-- Migration: Create cardiology procedures and ECG records tables with RLS.
BEGIN;

-- Create cardiology_procedures table
CREATE TABLE IF NOT EXISTS cardiology_procedures (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    procedure_type TEXT NOT NULL, -- e.g. 'Catheterization', 'Echocardiography', 'Stress Test'
    findings TEXT DEFAULT '',
    recommendations TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Create ecg_records table
CREATE TABLE IF NOT EXISTS ecg_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    leads_data JSONB NOT NULL, -- ECG voltage samples for leads (I, II, III, aVR, aVL, aVF, V1-V6)
    heart_rate INTEGER,
    interpretation TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS) on both tables
ALTER TABLE cardiology_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardiology_procedures FORCE ROW LEVEL SECURITY;

ALTER TABLE ecg_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecg_records FORCE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation
DROP POLICY IF EXISTS rls_cardiology_procedures_tenant_isolation ON cardiology_procedures;
CREATE POLICY rls_cardiology_procedures_tenant_isolation ON cardiology_procedures
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_ecg_records_tenant_isolation ON ecg_records;
CREATE POLICY rls_ecg_records_tenant_isolation ON ecg_records
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_cardiology_procedures_patient ON cardiology_procedures (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_ecg_records_patient ON ecg_records (tenant_id, patient_id);

-- Grant privileges to the application roles (Staging & Production)
GRANT ALL PRIVILEGES ON TABLE cardiology_procedures TO jumanasoft_staging_user;
GRANT ALL PRIVILEGES ON TABLE cardiology_procedures TO nama_medical_app;
GRANT ALL PRIVILEGES ON TABLE ecg_records TO jumanasoft_staging_user;
GRANT ALL PRIVILEGES ON TABLE ecg_records TO nama_medical_app;

GRANT USAGE, SELECT ON SEQUENCE cardiology_procedures_id_seq TO jumanasoft_staging_user;
GRANT USAGE, SELECT ON SEQUENCE cardiology_procedures_id_seq TO nama_medical_app;
GRANT USAGE, SELECT ON SEQUENCE ecg_records_id_seq TO jumanasoft_staging_user;
GRANT USAGE, SELECT ON SEQUENCE ecg_records_id_seq TO nama_medical_app;

COMMIT;
