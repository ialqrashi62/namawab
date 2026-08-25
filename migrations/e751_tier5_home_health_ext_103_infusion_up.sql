CREATE TABLE IF NOT EXISTS home_infusion (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  drug TEXT NOT NULL,
  pump TEXT NOT NULL,
  infusion_started_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_hi_t ON home_infusion(tenant_id, patient_id);
ALTER TABLE home_infusion ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_infusion FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_hi_t ON home_infusion;
CREATE POLICY p_hi_t ON home_infusion USING (tenant_id = current_setting('app.tenant_id', true));
