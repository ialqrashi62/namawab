-- e195 TIER3_PEDS-305 Pediatric Surgery UP
CREATE TABLE IF NOT EXISTS tier3_peds_surgery_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  intussusception_score INTEGER,
  hirschsprung_suspected BOOLEAN DEFAULT false,
  pyloric_stenosis_suspected BOOLEAN DEFAULT false,
  pas_score INTEGER,
  cdh_suspected BOOLEAN DEFAULT false,
  surgical_recommendation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_peds_surg_tenant ON tier3_peds_surgery_assessments(tenant_id);
ALTER TABLE tier3_peds_surgery_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_peds_surgery_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_peds_surg_t_tenant_isolation ON tier3_peds_surgery_assessments;
CREATE POLICY tier3_peds_surg_t_tenant_isolation ON tier3_peds_surgery_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));