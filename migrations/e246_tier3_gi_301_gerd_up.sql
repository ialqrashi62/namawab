-- e246 TIER3_GI-301 GERD/Esophagus UP
CREATE TABLE IF NOT EXISTS tier3_gi_esophagus_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  gerd_severity TEXT,
  barrett_dysplasia_grade TEXT,
  eoe_diagnosis BOOLEAN DEFAULT false,
  stricture_plan TEXT,
  achalasia_plan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_gi_eso_tenant ON tier3_gi_esophagus_assessments(tenant_id);
ALTER TABLE tier3_gi_esophagus_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_gi_esophagus_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_gi_eso_t_tenant_isolation ON tier3_gi_esophagus_assessments;
CREATE POLICY tier3_gi_eso_t_tenant_isolation ON tier3_gi_esophagus_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));