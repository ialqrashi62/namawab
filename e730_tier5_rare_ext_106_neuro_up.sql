-- filepath: e730_tier5_rare_ext_106_neuro_up.sql
CREATE TABLE IF NOT EXISTS rare_neuro_dx (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  disease TEXT NOT NULL,
  result TEXT NOT NULL,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rn_t ON rare_neuro_dx(tenant_id, disease);
ALTER TABLE rare_neuro_dx ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_neuro_dx FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_rn_t ON rare_neuro_dx;
CREATE POLICY p_rn_t ON rare_neuro_dx USING (tenant_id = current_setting('app.tenant_id', true));
