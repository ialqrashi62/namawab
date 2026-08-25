-- e220 TIER3_ENT-305 Pediatric ENT UP
CREATE TABLE IF NOT EXISTS tier3_ent_peds_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  om_treatment TEXT,
  adenoidectomy_indicated BOOLEAN DEFAULT false,
  tonsillectomy_indicated BOOLEAN DEFAULT false,
  hearing_screen_interpretation TEXT,
  airway_severity TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_ent_peds_tenant ON tier3_ent_peds_assessments(tenant_id);
ALTER TABLE tier3_ent_peds_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_ent_peds_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_ent_peds_t_tenant_isolation ON tier3_ent_peds_assessments;
CREATE POLICY tier3_ent_peds_t_tenant_isolation ON tier3_ent_peds_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));