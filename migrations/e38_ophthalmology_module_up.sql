-- Migration: Create ophthalmology eye_exams table with RLS and conditional grants.
BEGIN;

-- Create eye_exams table
CREATE TABLE IF NOT EXISTS eye_exams (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    exam_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Visual Acuity (Snellen or Decimal)
    od_va_uncorrected VARCHAR(20), -- Right Eye Uncorrected Visual Acuity
    os_va_uncorrected VARCHAR(20), -- Left Eye Uncorrected Visual Acuity
    od_va_corrected VARCHAR(20),   -- Right Eye Corrected Visual Acuity
    os_va_corrected VARCHAR(20),   -- Left Eye Corrected Visual Acuity
    
    -- Intraocular Pressure (IOP) in mmHg
    od_iop NUMERIC(4,1), -- Right Eye IOP
    os_iop NUMERIC(4,1), -- Left Eye IOP
    iop_method VARCHAR(50) DEFAULT 'Goldmann', -- Method: Goldmann, Tonopen, Airpuff
    
    -- Refraction Parameters
    od_sphere NUMERIC(4,2),
    os_sphere NUMERIC(4,2),
    od_cylinder NUMERIC(4,2),
    os_cylinder NUMERIC(4,2),
    od_axis INTEGER CHECK (od_axis IS NULL OR (od_axis >= 0 AND od_axis <= 180)),
    os_axis INTEGER CHECK (os_axis IS NULL OR (os_axis >= 0 AND os_axis <= 180)),
    
    -- Slit Lamp & Fundoscopy Findings
    slit_lamp_exam TEXT DEFAULT '',
    fundoscopy_exam TEXT DEFAULT '',
    
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS)
ALTER TABLE eye_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE eye_exams FORCE ROW LEVEL SECURITY;

-- Create RLS policy
DROP POLICY IF EXISTS rls_eye_exams_tenant_isolation ON eye_exams;
CREATE POLICY rls_eye_exams_tenant_isolation ON eye_exams
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create index
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
