-- e248 TIER3_GI-303 Hepatology UP
CREATE TABLE IF NOT EXISTS tier3_gi_hepatology_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  nafld_fibrosis_stage TEXT,
  hbv_dna_quantitative_result TEXT,
  hcv_genotype INTEGER,
  cirrhosis_status TEXT,
  child_pugh_score INTEGER,
  meld_score INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_gi_hep_tenant ON tier3_gi_hepatology_assessments(tenant_id);
ALTER TABLE tier3_gi_hepatology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_gi_hepatology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_gi_hep_t_tenant_isolation ON tier3_gi_hepatology_assessments;
CREATE POLICY tier3_gi_hep_t_tenant_isolation ON tier3_gi_hepatology_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));