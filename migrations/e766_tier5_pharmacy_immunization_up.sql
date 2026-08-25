-- e766 tier5 pharmacy immunization
CREATE TABLE IF NOT EXISTS pharmacy_immunization (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_imm_t ON pharmacy_immunization(tenant_id, patient_id);
ALTER TABLE pharmacy_immunization ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_immunization FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_imm_t ON pharmacy_immunization;
CREATE POLICY p_imm_t ON pharmacy_immunization USING (tenant_id = current_setting('app.tenant_id', true));
