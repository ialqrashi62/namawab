-- e229 TIER3_DERM-304 Pediatric Derm UP
CREATE TABLE IF NOT EXISTS tier3_derm_peds_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  scorad_severity TEXT,
  diaper_treatment TEXT,
  hemangioma_treatment TEXT,
  cmn_melanoma_risk TEXT,
  pediatric_skin_diagnosis TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_derm_peds_tenant ON tier3_derm_peds_assessments(tenant_id);
ALTER TABLE tier3_derm_peds_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_derm_peds_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_derm_peds_t_tenant_isolation ON tier3_derm_peds_assessments;
CREATE POLICY tier3_derm_peds_t_tenant_isolation ON tier3_derm_peds_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));