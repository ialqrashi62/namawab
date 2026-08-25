-- e209 TIER3_ANESTH-304 Pain Management UP
CREATE TABLE IF NOT EXISTS tier3_anesth_pain_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  vas_score INTEGER,
  pain_severity TEXT,
  who_ladder_step TEXT,
  pca_drug TEXT,
  pca_demand_dose_mg NUMERIC(6,2),
  morphine_equiv_mg_per_day NUMERIC(8,2),
  multimodal_protocol TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_anesth_pain_tenant ON tier3_anesth_pain_assessments(tenant_id);
ALTER TABLE tier3_anesth_pain_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_anesth_pain_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_anesth_pain_t_tenant_isolation ON tier3_anesth_pain_assessments;
CREATE POLICY tier3_anesth_pain_t_tenant_isolation ON tier3_anesth_pain_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));