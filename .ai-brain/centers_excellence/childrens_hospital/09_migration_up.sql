-- UP Children's Hospital
CREATE TABLE IF NOT EXISTS cx_childrens_hospital (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cx_childrens_hospital_tenant ON cx_childrens_hospital(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cx_childrens_hospital_patient ON cx_childrens_hospital(patient_id);
ALTER TABLE cx_childrens_hospital ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cx_childrens_hospital_tenant ON cx_childrens_hospital;
CREATE POLICY p_cx_childrens_hospital_tenant ON cx_childrens_hospital USING (tenant_id = current_setting('app.tenant_id')::uuid);
