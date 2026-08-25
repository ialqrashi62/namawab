-- e217 TIER3_ENT-302 Rhinology UP
CREATE TABLE IF NOT EXISTS tier3_ent_rhinology_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  aria_classification TEXT,
  crs_phenotype TEXT,
  polyps_visible BOOLEAN DEFAULT false,
  samters_triad BOOLEAN DEFAULT false,
  epistaxis_severity TEXT,
  olfactory_etiology TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_ent_rhin_tenant ON tier3_ent_rhinology_assessments(tenant_id);
ALTER TABLE tier3_ent_rhinology_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_ent_rhinology_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_ent_rhin_t_tenant_isolation ON tier3_ent_rhinology_assessments;
CREATE POLICY tier3_ent_rhin_t_tenant_isolation ON tier3_ent_rhinology_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));