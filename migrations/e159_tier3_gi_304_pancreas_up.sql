-- e159 TIER3_GI-304 Pancreas UP
CREATE TABLE IF NOT EXISTS pancreatitis_episodes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  episode_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  bisap_score INTEGER,
  severity VARCHAR(20),
  necrosis BOOLEAN,
  pseudocyst BOOLEAN,
  fluid_rate_ml_per_kg_per_h NUMERIC(4,2),
  onset_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE pancreatitis_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pancreatitis_episodes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS panc_e_tenant_isolation ON pancreatitis_episodes;
CREATE POLICY panc_e_tenant_isolation ON pancreatitis_episodes
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ercp_procedures (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  procedure_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  indication TEXT,
  timing VARCHAR(20),
  cholangitis VARCHAR(20),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ercp_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE ercp_procedures FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ercp_p_tenant_isolation ON ercp_procedures;
CREATE POLICY ercp_p_tenant_isolation ON ercp_procedures
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));