-- Migration: Create neurology and GCS/NIHSS assessment tables with RLS and conditional grants.
BEGIN;

-- Create neurology_assessments table
CREATE TABLE IF NOT EXISTS neurology_assessments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    gcs_eye INTEGER CHECK (gcs_eye BETWEEN 1 AND 4),
    gcs_verbal INTEGER CHECK (gcs_verbal BETWEEN 1 AND 5),
    gcs_motor INTEGER CHECK (gcs_motor BETWEEN 1 AND 6),
    gcs_total_score INTEGER CHECK (gcs_total_score BETWEEN 3 AND 15),
    nihss_score INTEGER CHECK (nihss_score BETWEEN 0 AND 42),
    reflexes_status VARCHAR(100), -- e.g. Normal, Hyperreflexia, Hyporeflexia, Absent
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS)
ALTER TABLE neurology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE neurology_assessments FORCE ROW LEVEL SECURITY;

-- Create RLS policy
DROP POLICY IF EXISTS rls_neurology_assessments_tenant_isolation ON neurology_assessments;
CREATE POLICY rls_neurology_assessments_tenant_isolation ON neurology_assessments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create index
CREATE INDEX IF NOT EXISTS idx_neurology_assessments_patient ON neurology_assessments (tenant_id, patient_id);

-- Grant privileges conditionally
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE neurology_assessments TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE neurology_assessments_id_seq TO jumanasoft_staging_user';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE neurology_assessments TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE neurology_assessments_id_seq TO nama_medical_app';
    END IF;
END
$$;

COMMIT;
