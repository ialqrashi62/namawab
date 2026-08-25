-- e219 TIER3_ENT-304 Head & Neck Oncology UP
CREATE TABLE IF NOT EXISTS tier3_ent_hnonc_cases (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  hpv_stage_group TEXT,
  thyroid_risk_category TEXT,
  laryngeal_t_category TEXT,
  salivary_surgical_indication TEXT,
  neck_mass_red_flags BOOLEAN DEFAULT false,
  malignancy_suspicion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_ent_hnonc_tenant ON tier3_ent_hnonc_cases(tenant_id);
ALTER TABLE tier3_ent_hnonc_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_ent_hnonc_cases FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_ent_hnonc_t_tenant_isolation ON tier3_ent_hnonc_cases;
CREATE POLICY tier3_ent_hnonc_t_tenant_isolation ON tier3_ent_hnonc_cases
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));