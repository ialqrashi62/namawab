-- e247 TIER3_NEPHRO-302 AKI UP
CREATE TABLE IF NOT EXISTS tier3_nephro_aki_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  aki_stage TEXT,
  classification TEXT,
  rrt_indicated BOOLEAN DEFAULT false,
  prevention_protocol TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_nephro_aki_tenant ON tier3_nephro_aki_assessments(tenant_id);
ALTER TABLE tier3_nephro_aki_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_nephro_aki_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_nephro_aki_t_tenant_isolation ON tier3_nephro_aki_assessments;
CREATE POLICY tier3_nephro_aki_t_tenant_isolation ON tier3_nephro_aki_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));