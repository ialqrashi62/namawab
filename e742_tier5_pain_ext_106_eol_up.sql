-- filepath: e742_tier5_pain_ext_106_eol_up.sql
CREATE TABLE IF NOT EXISTS eol_symptom (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  symptom TEXT NOT NULL,
  severity INT NOT NULL,
  plan TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_eol_t ON eol_symptom(tenant_id, symptom);
ALTER TABLE eol_symptom ENABLE ROW LEVEL SECURITY;
ALTER TABLE eol_symptom FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_eol_t ON eol_symptom;
CREATE POLICY p_eol_t ON eol_symptom USING (tenant_id = current_setting('app.tenant_id', true));
