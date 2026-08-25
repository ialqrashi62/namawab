-- e765 tier5 pharmacy stewardship
CREATE TABLE IF NOT EXISTS pharmacy_stewardship (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_stew_t ON pharmacy_stewardship(tenant_id, patient_id);
ALTER TABLE pharmacy_stewardship ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_stewardship FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_stew_t ON pharmacy_stewardship;
CREATE POLICY p_stew_t ON pharmacy_stewardship USING (tenant_id = current_setting('app.tenant_id', true));
