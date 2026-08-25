-- e193 TIER3_PEDS-303 Pediatric ER UP
CREATE TABLE IF NOT EXISTS tier3_peds_er_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  triage_level INTEGER,
  dehydration_pct INTEGER,
  asthma_severity TEXT,
  croup_diagnosis TEXT,
  bronchiolitis_diagnosis TEXT,
  dose_recommendation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_peds_er_tenant ON tier3_peds_er_assessments(tenant_id);
ALTER TABLE tier3_peds_er_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_peds_er_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_peds_er_t_tenant_isolation ON tier3_peds_er_assessments;
CREATE POLICY tier3_peds_er_t_tenant_isolation ON tier3_peds_er_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));