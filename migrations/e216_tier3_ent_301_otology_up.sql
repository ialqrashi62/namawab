-- e216 TIER3_ENT-301 Otology UP
CREATE TABLE IF NOT EXISTS tier3_ent_otology_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  aom_treatment TEXT,
  csom_management TEXT,
  ssnhl_urgency TEXT,
  tinnitus_red_flags BOOLEAN DEFAULT false,
  vertigo_diagnosis TEXT,
  bppv_maneuver TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_ent_otol_tenant ON tier3_ent_otology_assessments(tenant_id);
ALTER TABLE tier3_ent_otology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_ent_otology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_ent_otol_t_tenant_isolation ON tier3_ent_otology_assessments;
CREATE POLICY tier3_ent_otol_t_tenant_isolation ON tier3_ent_otology_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));