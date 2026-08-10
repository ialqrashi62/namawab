-- Migration: Create ophthalmology tables with RLS and conditional grants.
BEGIN;

-- Create eye_exams table if not exists
CREATE TABLE IF NOT EXISTS eye_exams (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    exam_date DATE NOT NULL DEFAULT CURRENT_DATE,
    od_va_uncorrected VARCHAR(10) DEFAULT '',
    os_va_uncorrected VARCHAR(10) DEFAULT '',
    od_va_corrected VARCHAR(10) DEFAULT '',
    os_va_corrected VARCHAR(10) DEFAULT '',
    od_iop NUMERIC DEFAULT 15,
    os_iop NUMERIC DEFAULT 15,
    iop_method VARCHAR(50) DEFAULT '',
    od_sphere NUMERIC DEFAULT 0.00,
    os_sphere NUMERIC DEFAULT 0.00,
    od_cylinder NUMERIC DEFAULT 0.00,
    os_cylinder NUMERIC DEFAULT 0.00,
    od_axis INTEGER DEFAULT 0,
    os_axis INTEGER DEFAULT 0,
    slit_lamp_exam TEXT DEFAULT '',
    fundoscopy_exam TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Add od_add and os_add if they don't exist
ALTER TABLE eye_exams ADD COLUMN IF NOT EXISTS od_add NUMERIC DEFAULT 0.00;
ALTER TABLE eye_exams ADD COLUMN IF NOT EXISTS os_add NUMERIC DEFAULT 0.00;

-- Enable Row-Level Security (RLS)
ALTER TABLE eye_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE eye_exams FORCE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS rls_eye_exams_tenant_isolation ON eye_exams;
CREATE POLICY rls_eye_exams_tenant_isolation ON eye_exams
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_eye_exams_patient ON eye_exams (tenant_id, patient_id);

-- Grant privileges conditionally
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE eye_exams TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE eye_exams_id_seq TO jumanasoft_staging_user';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE eye_exams TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE eye_exams_id_seq TO nama_medical_app';
    END IF;
END
$$;

COMMIT;
