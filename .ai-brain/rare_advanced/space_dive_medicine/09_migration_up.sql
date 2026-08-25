-- UP Space & Dive Medicine
CREATE TABLE IF NOT EXISTS cx_space_dive_medicine (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cx_space_dive_medicine_tenant ON cx_space_dive_medicine(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cx_space_dive_medicine_patient ON cx_space_dive_medicine(patient_id);
ALTER TABLE cx_space_dive_medicine ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cx_space_dive_medicine_tenant ON cx_space_dive_medicine;
CREATE POLICY p_cx_space_dive_medicine_tenant ON cx_space_dive_medicine USING (tenant_id = current_setting('app.tenant_id')::uuid);
