-- UP Cardiology & Vascular
CREATE TABLE IF NOT EXISTS cardiology_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id),
  patient_id uuid REFERENCES patients(id),
  payload jsonb NOT NULL DEFAULT '{}',
  status varchar(24) NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cardiology_assessments_tenant ON cardiology_assessments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cardiology_assessments_patient ON cardiology_assessments(patient_id);
ALTER TABLE cardiology_assessments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cardiology_assessments_tenant ON cardiology_assessments;
CREATE POLICY p_cardiology_assessments_tenant ON cardiology_assessments USING (tenant_id = current_setting('app.tenant_id')::uuid);
