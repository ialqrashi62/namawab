-- Migration: Create rheumatology and joint assessment tables with RLS and conditional grants.
BEGIN;

-- Create joint_assessments table
CREATE TABLE IF NOT EXISTS joint_assessments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    tender_joint_count INTEGER, -- TJC (0-28)
    swollen_joint_count INTEGER, -- SJC (0-28)
    vas_pain INTEGER, -- 0 to 100 mm
    das28_score NUMERIC(4,2), -- Calculated DAS28 score
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS)
ALTER TABLE joint_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE joint_assessments FORCE ROW LEVEL SECURITY;

-- Create RLS policy
DROP POLICY IF EXISTS rls_joint_assessments_tenant_isolation ON joint_assessments;
CREATE POLICY rls_joint_assessments_tenant_isolation ON joint_assessments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create index
CREATE INDEX IF NOT EXISTS idx_joint_assessments_patient ON joint_assessments (tenant_id, patient_id);

-- Grant privileges conditionally
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE joint_assessments TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE joint_assessments_id_seq TO jumanasoft_staging_user';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE joint_assessments TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE joint_assessments_id_seq TO nama_medical_app';
    END IF;
END
$$;

COMMIT;
