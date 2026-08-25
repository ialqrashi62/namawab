-- e147 TIER3_PULM-302 Asthma UP
CREATE TABLE IF NOT EXISTS asthma_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  assessment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  control_status VARCHAR(30),
  act_total INTEGER,
  current_step INTEGER,
  new_step INTEGER,
  eosinophil_count INTEGER,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assessed_by INTEGER
);
ALTER TABLE asthma_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE asthma_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS asthma_a_tenant_isolation ON asthma_assessments;
CREATE POLICY asthma_a_tenant_isolation ON asthma_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS asthma_action_plans (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  plan_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  peak_flow_pct NUMERIC(5,2),
  current_zone VARCHAR(10),
  instructions TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE asthma_action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE asthma_action_plans FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS asthma_ap_tenant_isolation ON asthma_action_plans;
CREATE POLICY asthma_ap_tenant_isolation ON asthma_action_plans
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS asthma_biologics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  biologic_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  drug_name VARCHAR(100),
  indication TEXT,
  start_date DATE,
  status VARCHAR(20) DEFAULT 'active'
);
ALTER TABLE asthma_biologics ENABLE ROW LEVEL SECURITY;
ALTER TABLE asthma_biologics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS asthma_b_tenant_isolation ON asthma_biologics;
CREATE POLICY asthma_b_tenant_isolation ON asthma_biologics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));