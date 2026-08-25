CREATE TABLE IF NOT EXISTS infusion_specialty (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_infusion_specialty_t ON infusion_specialty(tenant_id, patient_id);
ALTER TABLE infusion_specialty ENABLE ROW LEVEL SECURITY;
ALTER TABLE infusion_specialty FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_infusion_specialty_t ON infusion_specialty;
CREATE POLICY p_infusion_specialty_t ON infusion_specialty USING (tenant_id = current_setting('app.tenant_id', true));
