-- e210 TIER3_ANESTH-305 ICU Sedation UP
CREATE TABLE IF NOT EXISTS tier3_anesth_icu_sedation (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  rass_score INTEGER,
  cam_icu_result TEXT,
  sat_criteria_met BOOLEAN DEFAULT false,
  sbt_criteria_met BOOLEAN DEFAULT false,
  weaning_decision TEXT,
  icp_mmhg NUMERIC(5,2),
  icp_intervention TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_anesth_icu_tenant ON tier3_anesth_icu_sedation(tenant_id);
ALTER TABLE tier3_anesth_icu_sedation ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_anesth_icu_sedation FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_anesth_icu_t_tenant_isolation ON tier3_anesth_icu_sedation;
CREATE POLICY tier3_anesth_icu_t_tenant_isolation ON tier3_anesth_icu_sedation
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));