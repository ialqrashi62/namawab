-- e239 TIER3_RHEUM-304 Osteoporosis UP
CREATE TABLE IF NOT EXISTS tier3_rheum_osteoporosis_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  frax_major_pct NUMERIC(5,2),
  frax_hip_pct NUMERIC(5,2),
  dxa_classification TEXT,
  treatment_indicated BOOLEAN DEFAULT false,
  pagets_likely BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_rheum_osteo_tenant ON tier3_rheum_osteoporosis_assessments(tenant_id);
ALTER TABLE tier3_rheum_osteoporosis_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_rheum_osteoporosis_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_rheum_osteo_t_tenant_isolation ON tier3_rheum_osteoporosis_assessments;
CREATE POLICY tier3_rheum_osteo_t_tenant_isolation ON tier3_rheum_osteoporosis_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));