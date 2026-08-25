-- e226 TIER3_DERM-301 General Dermatology UP
CREATE TABLE IF NOT EXISTS tier3_derm_general_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  burn_tbsa_pct NUMERIC(5,2),
  burn_severity TEXT,
  sjs_ten_classification TEXT,
  dress_likely BOOLEAN DEFAULT false,
  acne_severity TEXT,
  psoriasis_pasi NUMERIC(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_derm_gen_tenant ON tier3_derm_general_assessments(tenant_id);
ALTER TABLE tier3_derm_general_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_derm_general_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_derm_gen_t_tenant_isolation ON tier3_derm_general_assessments;
CREATE POLICY tier3_derm_gen_t_tenant_isolation ON tier3_derm_general_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));