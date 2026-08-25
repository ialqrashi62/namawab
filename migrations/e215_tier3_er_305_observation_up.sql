-- e215 TIER3_ER-305 Observation Unit UP
CREATE TABLE IF NOT EXISTS tier3_er_observation_patients (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  admission_criteria_met BOOLEAN DEFAULT false,
  chest_pain_disposition TEXT,
  syncope_disposition TEXT,
  afib_disposition TEXT,
  observation_decision TEXT,
  los_hours INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_er_obs_tenant ON tier3_er_observation_patients(tenant_id);
ALTER TABLE tier3_er_observation_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_er_observation_patients FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_er_obs_t_tenant_isolation ON tier3_er_observation_patients;
CREATE POLICY tier3_er_obs_t_tenant_isolation ON tier3_er_observation_patients
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));