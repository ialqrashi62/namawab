-- e763 tier5 pharmacy safety
CREATE TABLE IF NOT EXISTS pharmacy_safety (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_safety_t ON pharmacy_safety(tenant_id, patient_id);
ALTER TABLE pharmacy_safety ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_safety FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_safety_t ON pharmacy_safety;
CREATE POLICY p_safety_t ON pharmacy_safety USING (tenant_id = current_setting('app.tenant_id', true));
