-- e251 TIER3_GI-301 GERD UP
CREATE TABLE IF NOT EXISTS tier3_gi_gerd_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  severity TEXT,
  eoe_likely BOOLEAN DEFAULT false,
  achalasia_diagnosis TEXT,
  barrett_screening_indicated BOOLEAN DEFAULT false,
  stricture_intervention TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_gi_gerd_tenant ON tier3_gi_gerd_assessments(tenant_id);
ALTER TABLE tier3_gi_gerd_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_gi_gerd_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_gi_gerd_t_tenant_isolation ON tier3_gi_gerd_assessments;
CREATE POLICY tier3_gi_gerd_t_tenant_isolation ON tier3_gi_gerd_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));