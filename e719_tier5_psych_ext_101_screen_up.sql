-- filepath: e719_tier5_psych_ext_101_screen_up.sql
-- TIER5_PSYCH_EXT-101: Screening tables (PHQ, GAD, MDQ, PCL)
CREATE TABLE IF NOT EXISTS psych_screen (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  screen_type TEXT NOT NULL,
  score INT NOT NULL,
  severity TEXT NOT NULL,
  screened_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_psych_s_t ON psych_screen(tenant_id, screen_type);
ALTER TABLE psych_screen ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_screen FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_psych_s_t ON psych_screen;
CREATE POLICY p_psych_s_t ON psych_screen USING (tenant_id = current_setting('app.tenant_id', true));
