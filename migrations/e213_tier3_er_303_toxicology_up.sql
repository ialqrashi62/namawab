-- e213 TIER3_ER-303 Toxicology UP
CREATE TABLE IF NOT EXISTS tier3_er_toxicology_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  acetaminophen_interpretation TEXT,
  nac_indications TEXT,
  salicylate_interpretation TEXT,
  opioid_toxidrome_present BOOLEAN DEFAULT false,
  naloxone_dose_mg NUMERIC(5,2),
  tca_qrs_ms INTEGER,
  tca_interpretation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_er_tox_tenant ON tier3_er_toxicology_assessments(tenant_id);
ALTER TABLE tier3_er_toxicology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_er_toxicology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_er_tox_t_tenant_isolation ON tier3_er_toxicology_assessments;
CREATE POLICY tier3_er_tox_t_tenant_isolation ON tier3_er_toxicology_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));