-- e161 TIER3_ENDO-301 Diabetes Mellitus UP
CREATE TABLE IF NOT EXISTS dm_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  dm_type VARCHAR(20),
  hba1c_pct NUMERIC(4,2),
  cgm_tir_pct NUMERIC(5,2),
  complications_screened BOOLEAN,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE dm_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dm_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dm_a_tenant_isolation ON dm_assessments;
CREATE POLICY dm_a_tenant_isolation ON dm_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS dka_hhs_episodes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  episode_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  episode_type VARCHAR(10),
  severity VARCHAR(20),
  fluid_total_ml INTEGER,
  insulin_dose_u_per_hr NUMERIC(6,2),
  resolved_at TIMESTAMPTZ,
  onset_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE dka_hhs_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dka_hhs_episodes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dka_e_tenant_isolation ON dka_hhs_episodes;
CREATE POLICY dka_e_tenant_isolation ON dka_hhs_episodes
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));