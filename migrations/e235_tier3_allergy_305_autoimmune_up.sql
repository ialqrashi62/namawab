-- e235 TIER3_ALLERGY-305 Autoimmune UP
CREATE TABLE IF NOT EXISTS tier3_allergy_autoimmune_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  ana_titer INTEGER,
  high_suspicion BOOLEAN DEFAULT false,
  jones_criteria_count INTEGER,
  lupus_flare_present BOOLEAN DEFAULT false,
  sjogren_likely BOOLEAN DEFAULT false,
  sarcoidosis_diagnosis TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_allergy_aut_tenant ON tier3_allergy_autoimmune_assessments(tenant_id);
ALTER TABLE tier3_allergy_autoimmune_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_allergy_autoimmune_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_allergy_aut_t_tenant_isolation ON tier3_allergy_autoimmune_assessments;
CREATE POLICY tier3_allergy_aut_t_tenant_isolation ON tier3_allergy_autoimmune_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));