-- e249 TIER3_NEPHRO-304 Glomerulonephritis UP
CREATE TABLE IF NOT EXISTS tier3_nephro_gn_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  nephrotic_diagnosis TEXT,
  nephritic_interpretation TEXT,
  iga_risk_stratification TEXT,
  mpgn_classification TEXT,
  rpgn_interpretation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_nephro_gn_tenant ON tier3_nephro_gn_assessments(tenant_id);
ALTER TABLE tier3_nephro_gn_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_nephro_gn_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_nephro_gn_t_tenant_isolation ON tier3_nephro_gn_assessments;
CREATE POLICY tier3_nephro_gn_t_tenant_isolation ON tier3_nephro_gn_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));