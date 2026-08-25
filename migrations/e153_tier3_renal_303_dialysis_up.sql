-- e153 TIER3_RENAL-303 Dialysis UP
CREATE TABLE IF NOT EXISTS hd_sessions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  session_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  pre_bun NUMERIC(6,2),
  post_bun NUMERIC(6,2),
  urr NUMERIC(5,2),
  spkt_v NUMERIC(5,2),
  target_met BOOLEAN,
  access_type VARCHAR(20),
  blood_flow_ml_min INTEGER,
  session_hours NUMERIC(4,2),
  session_date DATE
);
ALTER TABLE hd_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hd_sessions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hd_s_tenant_isolation ON hd_sessions;
CREATE POLICY hd_s_tenant_isolation ON hd_sessions
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pd_adequacy (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  adequacy_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  weekly_krt NUMERIC(5,2),
  modality VARCHAR(10),
  adequate BOOLEAN,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE pd_adequacy ENABLE ROW LEVEL SECURITY;
ALTER TABLE pd_adequacy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pd_a_tenant_isolation ON pd_adequacy;
CREATE POLICY pd_a_tenant_isolation ON pd_adequacy
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));