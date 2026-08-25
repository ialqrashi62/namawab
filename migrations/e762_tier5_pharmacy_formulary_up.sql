-- e762 tier5 pharmacy formulary
CREATE TABLE IF NOT EXISTS pharmacy_formulary (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_formulary_t ON pharmacy_formulary(tenant_id, patient_id);
ALTER TABLE pharmacy_formulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_formulary FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_formulary_t ON pharmacy_formulary;
CREATE POLICY p_formulary_t ON pharmacy_formulary USING (tenant_id = current_setting('app.tenant_id', true));
