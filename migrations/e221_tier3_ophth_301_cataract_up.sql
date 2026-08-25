-- e221 TIER3_OPHTH-301 Cataract UP
CREATE TABLE IF NOT EXISTS tier3_ophth_cataract_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  locs_iii_no INTEGER,
  locs_iii_cortical INTEGER,
  locs_iii_psc INTEGER,
  va_logmar NUMERIC(4,2),
  surgical_indication BOOLEAN DEFAULT false,
  iol_power_diopters NUMERIC(5,2),
  endophthalmitis_suspicion TEXT,
  dry_eye_severity TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_ophth_cat_tenant ON tier3_ophth_cataract_assessments(tenant_id);
ALTER TABLE tier3_ophth_cataract_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_ophth_cataract_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_ophth_cat_t_tenant_isolation ON tier3_ophth_cataract_assessments;
CREATE POLICY tier3_ophth_cat_t_tenant_isolation ON tier3_ophth_cataract_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));