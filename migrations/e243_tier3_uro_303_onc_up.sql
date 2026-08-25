-- e243 TIER3_URO-303 Oncology UP
CREATE TABLE IF NOT EXISTS tier3_uro_oncology_cases (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  prostate_risk_group TEXT,
  rcc_stage TEXT,
  bladder_risk_category TEXT,
  testicular_classification TEXT,
  penile_stage TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_uro_onc_tenant ON tier3_uro_oncology_cases(tenant_id);
ALTER TABLE tier3_uro_oncology_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_uro_oncology_cases FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_uro_onc_t_tenant_isolation ON tier3_uro_oncology_cases;
CREATE POLICY tier3_uro_onc_t_tenant_isolation ON tier3_uro_oncology_cases
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));