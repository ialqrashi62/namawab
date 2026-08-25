-- filepath: e740_tier5_pain_ext_104_headache_up.sql
CREATE TABLE IF NOT EXISTS headache_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  headache_type TEXT NOT NULL,
  red_flag_presence BOOLEAN NOT NULL,
  preventive TEXT,
  log_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_hl2_t ON headache_log(tenant_id, patient_id);
ALTER TABLE headache_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE headache_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_hl2_t ON headache_log;
CREATE POLICY p_hl2_t ON headache_log USING (tenant_id = current_setting('app.tenant_id', true));
