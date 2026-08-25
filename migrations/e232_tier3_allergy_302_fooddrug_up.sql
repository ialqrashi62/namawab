-- e232 TIER3_ALLERGY-302 Food/Drug Allergy UP
CREATE TABLE IF NOT EXISTS tier3_allergy_fooddrug_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  allergen TEXT,
  oit_candidate BOOLEAN DEFAULT false,
  delabeling_eligible BOOLEAN DEFAULT false,
  penicillin_testing_indicated BOOLEAN DEFAULT false,
  latex_high_risk BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_allergy_fda_tenant ON tier3_allergy_fooddrug_assessments(tenant_id);
ALTER TABLE tier3_allergy_fooddrug_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_allergy_fooddrug_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_allergy_fda_t_tenant_isolation ON tier3_allergy_fooddrug_assessments;
CREATE POLICY tier3_allergy_fda_t_tenant_isolation ON tier3_allergy_fooddrug_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));