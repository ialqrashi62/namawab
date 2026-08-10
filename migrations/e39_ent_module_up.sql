-- Migration: Create ent audiogram_records table with RLS and conditional grants.
BEGIN;

-- Create audiogram_records table
CREATE TABLE IF NOT EXISTS audiogram_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    test_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Right Ear Air Conduction (AC) Thresholds in dB
    right_ac_250 INTEGER,
    right_ac_500 INTEGER,
    right_ac_1000 INTEGER,
    right_ac_2000 INTEGER,
    right_ac_4000 INTEGER,
    right_ac_8000 INTEGER,
    
    -- Left Ear Air Conduction (AC) Thresholds in dB
    left_ac_250 INTEGER,
    left_ac_500 INTEGER,
    left_ac_1000 INTEGER,
    left_ac_2000 INTEGER,
    left_ac_4000 INTEGER,
    left_ac_8000 INTEGER,
    
    -- Bone Conduction (BC) Thresholds in dB
    right_bc_250 INTEGER,
    right_bc_500 INTEGER,
    right_bc_1000 INTEGER,
    right_bc_2000 INTEGER,
    right_bc_4000 INTEGER,
    
    left_bc_250 INTEGER,
    left_bc_500 INTEGER,
    left_bc_1000 INTEGER,
    left_bc_2000 INTEGER,
    left_bc_4000 INTEGER,
    
    -- Speech Audiometry
    right_srt INTEGER,
    left_srt INTEGER,
    right_sd_score INTEGER CHECK (right_sd_score IS NULL OR (right_sd_score >= 0 AND right_sd_score <= 100)),
    left_sd_score INTEGER CHECK (left_sd_score IS NULL OR (left_sd_score >= 0 AND left_sd_score <= 100)),
    
    -- Otoscopy & Tympanometry Findings
    otoscopy_right TEXT DEFAULT '',
    otoscopy_left TEXT DEFAULT '',
    tympanometry_right VARCHAR(50),
    tympanometry_left VARCHAR(50),
    
    interpretation TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS)
ALTER TABLE audiogram_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audiogram_records FORCE ROW LEVEL SECURITY;

-- Create RLS policy
DROP POLICY IF EXISTS rls_audiogram_records_tenant_isolation ON audiogram_records;
CREATE POLICY rls_audiogram_records_tenant_isolation ON audiogram_records
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create index
CREATE INDEX IF NOT EXISTS idx_audiogram_records_patient ON audiogram_records (tenant_id, patient_id);

-- Grant privileges conditionally
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE audiogram_records TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE audiogram_records_id_seq TO jumanasoft_staging_user';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE audiogram_records TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE audiogram_records_id_seq TO nama_medical_app';
    END IF;
END
$$;

COMMIT;
