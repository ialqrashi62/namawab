-- filepath: e713_tier5_rehab_ext_101_pt_assess_up.sql
-- TIER5_REHAB_EXT-101: PT assessment + FIM
CREATE TABLE IF NOT EXISTS rehab_assessment (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  discipline TEXT NOT NULL,
  score_total INT NOT NULL,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rehab_a_t_patient ON rehab_assessment(tenant_id, patient_id);

ALTER TABLE rehab_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_assessment FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_rehab_a_t ON rehab_assessment;
CREATE POLICY p_rehab_a_t ON rehab_assessment USING (tenant_id = current_setting('app.tenant_id', true));
