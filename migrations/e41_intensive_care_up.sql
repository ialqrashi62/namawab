-- Migration: Create intensive_care tables with RLS and conditional grants.
BEGIN;

-- Create icu_assessments table
CREATE TABLE IF NOT EXISTS icu_assessments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- APACHE II physiological variable points
    apache_temp INTEGER NOT NULL DEFAULT 0,
    apache_map INTEGER NOT NULL DEFAULT 0,
    apache_hr INTEGER NOT NULL DEFAULT 0,
    apache_rr INTEGER NOT NULL DEFAULT 0,
    apache_pao2 INTEGER NOT NULL DEFAULT 0,
    apache_ph INTEGER NOT NULL DEFAULT 0,
    apache_na INTEGER NOT NULL DEFAULT 0,
    apache_k INTEGER NOT NULL DEFAULT 0,
    apache_creatinine INTEGER NOT NULL DEFAULT 0,
    apache_hct INTEGER NOT NULL DEFAULT 0,
    apache_wbc INTEGER NOT NULL DEFAULT 0,
    apache_gcs INTEGER NOT NULL DEFAULT 0,
    
    -- APACHE II age & chronic health points
    apache_age_points INTEGER NOT NULL DEFAULT 0,
    apache_chronic_points INTEGER NOT NULL DEFAULT 0,
    apache_ii_score INTEGER NOT NULL DEFAULT 0,
    
    -- SOFA organ dysfunction points
    sofa_pao2_fio2 INTEGER NOT NULL DEFAULT 0,
    sofa_platelets INTEGER NOT NULL DEFAULT 0,
    sofa_bilirubin INTEGER NOT NULL DEFAULT 0,
    sofa_map_vasopressor INTEGER NOT NULL DEFAULT 0,
    sofa_gcs INTEGER NOT NULL DEFAULT 0,
    sofa_creatinine INTEGER NOT NULL DEFAULT 0,
    sofa_score INTEGER NOT NULL DEFAULT 0,
    
    clinical_notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS)
ALTER TABLE icu_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_assessments FORCE ROW LEVEL SECURITY;

-- Create RLS policy
DROP POLICY IF EXISTS rls_icu_assessments_tenant_isolation ON icu_assessments;
CREATE POLICY rls_icu_assessments_tenant_isolation ON icu_assessments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create index
CREATE INDEX IF NOT EXISTS idx_icu_assessments_patient ON icu_assessments (tenant_id, patient_id);

-- Grant privileges conditionally
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE icu_assessments TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE icu_assessments_id_seq TO jumanasoft_staging_user';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE icu_assessments TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE icu_assessments_id_seq TO nama_medical_app';
    END IF;
END
$$;

COMMIT;
