-- e224 TIER3_OPHTH-304 Cornea / Refractive UP
CREATE TABLE IF NOT EXISTS tier3_ophth_cornea_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  keratoconus_diagnosis TEXT,
  refractive_candidate BOOLEAN DEFAULT false,
  refractive_procedure_recommendation TEXT,
  ulcer_severity TEXT,
  pterygium_surgical_indicated BOOLEAN DEFAULT false,
  fuchs_progression_risk TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_ophth_cor_tenant ON tier3_ophth_cornea_assessments(tenant_id);
ALTER TABLE tier3_ophth_cornea_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_ophth_cornea_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_ophth_cor_t_tenant_isolation ON tier3_ophth_cornea_assessments;
CREATE POLICY tier3_ophth_cor_t_tenant_isolation ON tier3_ophth_cornea_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));