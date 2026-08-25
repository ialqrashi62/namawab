-- filepath: e739_tier5_pain_ext_103_cancer_up.sql
CREATE TABLE IF NOT EXISTS cancer_pain (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cancer_type TEXT NOT NULL,
  pain_mechanism TEXT NOT NULL,
  ladder_step INT NOT NULL,
  plan TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cpx_t ON cancer_pain(tenant_id, patient_id);
ALTER TABLE cancer_pain ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancer_pain FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cpx_t ON cancer_pain;
CREATE POLICY p_cpx_t ON cancer_pain USING (tenant_id = current_setting('app.tenant_id', true));
