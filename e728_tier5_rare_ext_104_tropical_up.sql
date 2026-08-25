-- filepath: e728_tier5_rare_ext_104_tropical_up.sql
CREATE TABLE IF NOT EXISTS rare_trop (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  disease TEXT NOT NULL,
  exposure_history TEXT,
  result TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rt_t ON rare_trop(tenant_id, disease);
ALTER TABLE rare_trop ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_trop FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_rt_t ON rare_trop;
CREATE POLICY p_rt_t ON rare_trop USING (tenant_id = current_setting('app.tenant_id', true));
