-- e223 TIER3_OPHTH-303 Retina UP
CREATE TABLE IF NOT EXISTS tier3_ophth_retina_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  amd_classification TEXT,
  dr_grade TEXT,
  dme_present BOOLEAN DEFAULT false,
  retinal_detachment_urgency TEXT,
  crao_treatment_window TEXT,
  intravitreal_drug TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_ophth_ret_tenant ON tier3_ophth_retina_assessments(tenant_id);
ALTER TABLE tier3_ophth_retina_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_ophth_retina_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_ophth_ret_t_tenant_isolation ON tier3_ophth_retina_assessments;
CREATE POLICY tier3_ophth_ret_t_tenant_isolation ON tier3_ophth_retina_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));