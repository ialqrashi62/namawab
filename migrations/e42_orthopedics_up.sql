-- Migration: Create orthopedics tables with RLS and conditional grants.
BEGIN;

-- Create orthopedic_implants table
CREATE TABLE IF NOT EXISTS orthopedic_implants (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    implant_date DATE NOT NULL DEFAULT CURRENT_DATE,
    implant_type VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    model_name VARCHAR(100) DEFAULT '',
    serial_number VARCHAR(100) NOT NULL,
    size_dimension VARCHAR(50) DEFAULT '',
    batch_lot_number VARCHAR(100) DEFAULT '',
    clinical_notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Create joint_rom_assessments table
CREATE TABLE IF NOT EXISTS joint_rom_assessments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id INTEGER REFERENCES system_users(id) ON DELETE SET NULL,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    joint_name VARCHAR(50) NOT NULL,
    lateral_side VARCHAR(10) NOT NULL, -- Left, Right, Bilateral
    movement_type VARCHAR(50) NOT NULL, -- Flexion, Extension, Abduction, Adduction, etc.
    angle_degrees INTEGER NOT NULL,
    is_restricted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL,
    facility_id INTEGER
);

-- Enable Row-Level Security (RLS)
ALTER TABLE orthopedic_implants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orthopedic_implants FORCE ROW LEVEL SECURITY;

ALTER TABLE joint_rom_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE joint_rom_assessments FORCE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS rls_orthopedic_implants_tenant_isolation ON orthopedic_implants;
CREATE POLICY rls_orthopedic_implants_tenant_isolation ON orthopedic_implants
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

DROP POLICY IF EXISTS rls_joint_rom_assessments_tenant_isolation ON joint_rom_assessments;
CREATE POLICY rls_joint_rom_assessments_tenant_isolation ON joint_rom_assessments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orthopedic_implants_patient ON orthopedic_implants (tenant_id, patient_id);
CREATE INDEX IF NOT EXISTS idx_joint_rom_assessments_patient ON joint_rom_assessments (tenant_id, patient_id);

-- Grant privileges conditionally
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'jumanasoft_staging_user') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE orthopedic_implants, joint_rom_assessments TO jumanasoft_staging_user';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE orthopedic_implants_id_seq, joint_rom_assessments_id_seq TO jumanasoft_staging_user';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'nama_medical_app') THEN
        EXECUTE 'GRANT ALL PRIVILEGES ON TABLE orthopedic_implants, joint_rom_assessments TO nama_medical_app';
        EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE orthopedic_implants_id_seq, joint_rom_assessments_id_seq TO nama_medical_app';
    END IF;
END
$$;

COMMIT;
