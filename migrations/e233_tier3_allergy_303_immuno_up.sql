-- e233 TIER3_ALLERGY-303 Immunodeficiency UP
CREATE TABLE IF NOT EXISTS tier3_allergy_immuno_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  warning_signs_present BOOLEAN DEFAULT false,
  sad_likely BOOLEAN DEFAULT false,
  cvid_likely BOOLEAN DEFAULT false,
  scid_suspected BOOLEAN DEFAULT false,
  ig_monthly_dose_g NUMERIC(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_allergy_imm_tenant ON tier3_allergy_immuno_assessments(tenant_id);
ALTER TABLE tier3_allergy_immuno_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_allergy_immuno_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_allergy_imm_t_tenant_isolation ON tier3_allergy_immuno_assessments;
CREATE POLICY tier3_allergy_imm_t_tenant_isolation ON tier3_allergy_immuno_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));