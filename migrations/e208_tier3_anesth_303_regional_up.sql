-- e208 TIER3_ANESTH-303 Regional Anesthesia UP
CREATE TABLE IF NOT EXISTS tier3_anesth_regional_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  spinal_dose_mg NUMERIC(5,2),
  expected_block_level TEXT,
  epidural_total_mg_per_h NUMERIC(6,2),
  recommended_block TEXT,
  coagulation_safe BOOLEAN DEFAULT true,
  last_action TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_anesth_reg_tenant ON tier3_anesth_regional_assessments(tenant_id);
ALTER TABLE tier3_anesth_regional_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_anesth_regional_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_anesth_reg_t_tenant_isolation ON tier3_anesth_regional_assessments;
CREATE POLICY tier3_anesth_reg_t_tenant_isolation ON tier3_anesth_regional_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));