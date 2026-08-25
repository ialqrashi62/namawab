-- filepath: e724_tier5_psych_ext_106_sud_sz_up.sql
CREATE TABLE IF NOT EXISTS sud_assessment (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  substance TEXT NOT NULL,
  severity_score INT NOT NULL,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sud_a_t ON sud_assessment(tenant_id, substance);
ALTER TABLE sud_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE sud_assessment FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_sud_a_t ON sud_assessment;
CREATE POLICY p_sud_a_t ON sud_assessment USING (tenant_id = current_setting('app.tenant_id', true));
