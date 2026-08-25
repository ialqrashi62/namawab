-- e206 TIER3_ANESTH-301 Preop Assessment UP
CREATE TABLE IF NOT EXISTS tier3_anesth_preop_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  rcri_score INTEGER,
  cardiac_risk_pct NUMERIC(5,2),
  ariscat_score INTEGER,
  pulmonary_risk TEXT,
  npo_status TEXT,
  ready_for_surgery BOOLEAN DEFAULT false,
  anticoagulation_recommendation TEXT,
  tests_ordered TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_anesth_preop_tenant ON tier3_anesth_preop_assessments(tenant_id);
ALTER TABLE tier3_anesth_preop_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_anesth_preop_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_anesth_preop_t_tenant_isolation ON tier3_anesth_preop_assessments;
CREATE POLICY tier3_anesth_preop_t_tenant_isolation ON tier3_anesth_preop_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));