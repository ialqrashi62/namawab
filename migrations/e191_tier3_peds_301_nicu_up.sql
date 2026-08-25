-- e191 TIER3_PEDS-301 NICU UP
CREATE TABLE IF NOT EXISTS tier3_peds_nicu_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  apgar_at_1_minute INTEGER,
  apgar_at_5_minute INTEGER,
  silverman_score INTEGER,
  sepsis_risk TEXT,
  rop_screening_indicated BOOLEAN DEFAULT false,
  nrp_steps_applied TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_peds_nicu_tenant ON tier3_peds_nicu_assessments(tenant_id);
ALTER TABLE tier3_peds_nicu_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_peds_nicu_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_peds_nicu_t_tenant_isolation ON tier3_peds_nicu_assessments;
CREATE POLICY tier3_peds_nicu_t_tenant_isolation ON tier3_peds_nicu_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));