CREATE TABLE IF NOT EXISTS infusion_home (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_infusion_home_t ON infusion_home(tenant_id, patient_id);
ALTER TABLE infusion_home ENABLE ROW LEVEL SECURITY;
ALTER TABLE infusion_home FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_infusion_home_t ON infusion_home;
CREATE POLICY p_infusion_home_t ON infusion_home USING (tenant_id = current_setting('app.tenant_id', true));
