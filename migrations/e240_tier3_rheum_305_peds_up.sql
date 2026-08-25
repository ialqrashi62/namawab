-- e240 TIER3_RHEUM-305 Pediatric Rheum UP
CREATE TABLE IF NOT EXISTS tier3_rheum_peds_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  jia_subtype TEXT,
  kawasaki_diagnosis BOOLEAN DEFAULT false,
  iga_vasculitis_likely BOOLEAN DEFAULT false,
  jdm_classification TEXT,
  pediatric_sle_diagnosis BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_rheum_peds_tenant ON tier3_rheum_peds_assessments(tenant_id);
ALTER TABLE tier3_rheum_peds_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_rheum_peds_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_rheum_peds_t_tenant_isolation ON tier3_rheum_peds_assessments;
CREATE POLICY tier3_rheum_peds_t_tenant_isolation ON tier3_rheum_peds_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));