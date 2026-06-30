-- Migration: Create gastroenterology tables with RLS and conditional grants.
BEGIN;

-- Create endoscopy_reports table
CREATE TABLE IF NOT EXISTS endoscopy_reports (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    endoscopy_type TEXT NOT NULL, -- e.g. 'Gastroscopy', 'Colonoscopy', 'ERCP'
    indications TEXT DEFAULT '',
    findings TEXT DEFAULT '',
    complications TEXT DEFAULT '',
    recommendations TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Create biopsy_samples table
CREATE TABLE IF NOT EXISTS biopsy_samples (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    specimen_source TEXT NOT NULL, -- e.g. 'Gastric Antrum', 'Sigmoid Colon'
    clinical_notes TEXT DEFAULT '',
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Resulted'
    result_findings TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS)
ALTER TABLE endoscopy_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE endoscopy_reports FORCE ROW LEVEL SECURITY;

ALTER TABLE biopsy_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE biopsy_samples FORCE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS rls_endoscopy_reports_tenant_isolation ON endoscopy_reports;
CREATE POLICY rls_endoscopy_reports_tenant_isolation ON endoscopy_reports
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_biopsy_samples_tenant_isolation ON biopsy_samples;
CREATE POLICY rls_biopsy_samples_tenant_isolation ON biopsy_samples
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_endoscopy_reports_patient ON endoscopy_reports (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_biopsy_samples_patient ON biopsy_samples (tenant_id, patient_id);

-- Grant privileges conditionally
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE endoscopy_reports TO jumanasoft_staging_user';
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE biopsy_samples TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE endoscopy_reports_id_seq TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE biopsy_samples_id_seq TO jumanasoft_staging_user';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE endoscopy_reports TO nama_medical_app';
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE biopsy_samples TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE endoscopy_reports_id_seq TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE biopsy_samples_id_seq TO nama_medical_app';
    END IF;
END
$$;

COMMIT;
