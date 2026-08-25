-- filepath: e715_tier5_rehab_ext_103_speech_swallow_up.sql
CREATE TABLE IF NOT EXISTS speech_eval (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  eval_type TEXT NOT NULL,
  result TEXT NOT NULL,
  diet_recommendation TEXT,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_speech_t_pat ON speech_eval(tenant_id, patient_id);
ALTER TABLE speech_eval ENABLE ROW LEVEL SECURITY;
ALTER TABLE speech_eval FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_speech_t ON speech_eval;
CREATE POLICY p_speech_t ON speech_eval USING (tenant_id = current_setting('app.tenant_id', true));
