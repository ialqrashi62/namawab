-- e150 TIER3_PULM-305 Sleep Medicine UP
CREATE TABLE IF NOT EXISTS sleep_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  stop_bang_score INTEGER,
  risk VARCHAR(20),
  ahi NUMERIC(6,2),
  osa_severity VARCHAR(20),
  cpap_pressure NUMERIC(5,2),
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assessed_by INTEGER
);
ALTER TABLE sleep_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sleep_a_tenant_isolation ON sleep_assessments;
CREATE POLICY sleep_a_tenant_isolation ON sleep_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS sleep_cpap_titrations (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  titration_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  initial_pressure NUMERIC(5,2),
  new_pressure NUMERIC(5,2),
  residual_ahi NUMERIC(6,2),
  leak_rate NUMERIC(5,2),
  titration_date DATE
);
ALTER TABLE sleep_cpap_titrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_cpap_titrations FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sleep_t_tenant_isolation ON sleep_cpap_titrations;
CREATE POLICY sleep_t_tenant_isolation ON sleep_cpap_titrations
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));