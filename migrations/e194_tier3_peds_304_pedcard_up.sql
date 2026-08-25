-- e194 TIER3_PEDS-304 Pediatric Cardiology UP
CREATE TABLE IF NOT EXISTS tier3_peds_cardiology_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  ecg_interpretation TEXT,
  kawasaki_diagnosis TEXT,
  chd_screen_result TEXT,
  hypertension_flag TEXT,
  murmur_classification TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_peds_cardio_tenant ON tier3_peds_cardiology_assessments(tenant_id);
ALTER TABLE tier3_peds_cardiology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_peds_cardiology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_peds_cardio_t_tenant_isolation ON tier3_peds_cardiology_assessments;
CREATE POLICY tier3_peds_cardio_t_tenant_isolation ON tier3_peds_cardiology_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));