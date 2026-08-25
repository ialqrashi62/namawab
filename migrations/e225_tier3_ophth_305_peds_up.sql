-- e225 TIER3_OPHTH-305 Pediatric / Strabismus UP
CREATE TABLE IF NOT EXISTS tier3_ophth_peds_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  vision_screening_referral BOOLEAN DEFAULT false,
  amblyopia_risk TEXT,
  strabismus_management TEXT,
  pediatric_cataract_surgery_indicated BOOLEAN DEFAULT false,
  retinoblastoma_suspected BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_ophth_peds_tenant ON tier3_ophth_peds_assessments(tenant_id);
ALTER TABLE tier3_ophth_peds_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_ophth_peds_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_ophth_peds_t_tenant_isolation ON tier3_ophth_peds_assessments;
CREATE POLICY tier3_ophth_peds_t_tenant_isolation ON tier3_ophth_peds_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));