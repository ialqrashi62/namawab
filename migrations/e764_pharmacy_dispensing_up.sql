CREATE TABLE IF NOT EXISTS pharmacy_dispensing (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pharmacy_dispensing_t ON pharmacy_dispensing(tenant_id, patient_id);
ALTER TABLE pharmacy_dispensing ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_dispensing FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pharmacy_dispensing_t ON pharmacy_dispensing;
CREATE POLICY p_pharmacy_dispensing_t ON pharmacy_dispensing USING (tenant_id = current_setting('app.tenant_id', true));
