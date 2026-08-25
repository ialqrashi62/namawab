-- e250 TIER3_GI-305 GI Bleed UP
CREATE TABLE IF NOT EXISTS tier3_gi_gibleed_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  upper_or_lower_bleed TEXT,
  variceal_bleeding_risk TEXT,
  forrest_classification TEXT,
  initial_hemoglobin NUMERIC(5,2),
  transfusion_threshold TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_gi_gib_tenant ON tier3_gi_gibleed_assessments(tenant_id);
ALTER TABLE tier3_gi_gibleed_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_gi_gibleed_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_gi_gib_t_tenant_isolation ON tier3_gi_gibleed_assessments;
CREATE POLICY tier3_gi_gib_t_tenant_isolation ON tier3_gi_gibleed_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));