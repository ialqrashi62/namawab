-- filepath: e721_tier5_psych_ext_103_anxiety_up.sql
CREATE TABLE IF NOT EXISTS anxiety_session (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  module TEXT NOT NULL,
  session_number INT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_anxiety_t ON anxiety_session(tenant_id, patient_id);
ALTER TABLE anxiety_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE anxiety_session FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_anxiety_t ON anxiety_session;
CREATE POLICY p_anxiety_t ON anxiety_session USING (tenant_id = current_setting('app.tenant_id', true));
