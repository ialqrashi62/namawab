-- filepath: e734_tier5_derm2_ext_104_hair_up.sql
CREATE TABLE IF NOT EXISTS hair_loss (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pattern TEXT NOT NULL,
  norwood INT,
  measured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_hl_t ON hair_loss(tenant_id, patient_id);
ALTER TABLE hair_loss ENABLE ROW LEVEL SECURITY;
ALTER TABLE hair_loss FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_hl_t ON hair_loss;
CREATE POLICY p_hl_t ON hair_loss USING (tenant_id = current_setting('app.tenant_id', true));
