-- Migration: Create plastic_burns tables with RLS and conditional grants.
BEGIN;

-- Create burn_assessments table
CREATE TABLE IF NOT EXISTS burn_assessments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg DECIMAL NOT NULL,
    
    -- Body region burn percentages (Rule of Nines)
    head_percent DECIMAL DEFAULT 0,
    torso_front_percent DECIMAL DEFAULT 0,
    torso_back_percent DECIMAL DEFAULT 0,
    left_arm_percent DECIMAL DEFAULT 0,
    right_arm_percent DECIMAL DEFAULT 0,
    left_leg_percent DECIMAL DEFAULT 0,
    right_leg_percent DECIMAL DEFAULT 0,
    perineum_percent DECIMAL DEFAULT 0,
    
    tbsa_percent DECIMAL NOT NULL, -- Total Body Surface Area
    parkland_fluid_ml DECIMAL NOT NULL, -- Calculated 24h fluid requirement
    fluid_first_8h_ml DECIMAL NOT NULL,
    fluid_next_16h_ml DECIMAL NOT NULL,
    
    clinical_notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Create clinical_photos_meta table
CREATE TABLE IF NOT EXISTS clinical_photos_meta (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    photo_date DATE NOT NULL DEFAULT CURRENT_DATE,
    body_region VARCHAR(100) NOT NULL,
    description TEXT DEFAULT '',
    is_confidential BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS)
ALTER TABLE burn_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE burn_assessments FORCE ROW LEVEL SECURITY;

ALTER TABLE clinical_photos_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_photos_meta FORCE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS rls_burn_assessments_tenant_isolation ON burn_assessments;
CREATE POLICY rls_burn_assessments_tenant_isolation ON burn_assessments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_clinical_photos_meta_tenant_isolation ON clinical_photos_meta;
CREATE POLICY rls_clinical_photos_meta_tenant_isolation ON clinical_photos_meta
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_burn_assessments_patient ON burn_assessments (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_photos_meta_patient ON clinical_photos_meta (tenant_id, patient_id);

-- Grant privileges conditionally
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE burn_assessments, clinical_photos_meta TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE burn_assessments_id_seq, clinical_photos_meta_id_seq TO jumanasoft_staging_user';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE burn_assessments, clinical_photos_meta TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE burn_assessments_id_seq, clinical_photos_meta_id_seq TO nama_medical_app';
    END IF;
END
$$;

COMMIT;
