-- e258 TIER3_ICU-103 Shock Management UP
CREATE TABLE IF NOT EXISTS icu_shock_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  shock_type VARCHAR(40),
  cardiac_index NUMERIC(4,2),
  svr NUMERIC(7,1),
  cvp NUMERIC(4,1),
  lactate NUMERIC(5,2),
  fluid_responsive VARCHAR(5),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE icu_shock_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_shock_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS icu_sh_tenant_isolation ON icu_shock_assessments;
CREATE POLICY icu_sh_tenant_isolation ON icu_shock_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS icu_hemodynamic_monitoring (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  monitoring_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  modality VARCHAR(30),
  map_value NUMERIC(5,2),
  cardiac_output NUMERIC(4,2),
  svri NUMERIC(7,1),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE icu_hemodynamic_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_hemodynamic_monitoring FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS icu_hm_tenant_isolation ON icu_hemodynamic_monitoring;
CREATE POLICY icu_hm_tenant_isolation ON icu_hemodynamic_monitoring
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));