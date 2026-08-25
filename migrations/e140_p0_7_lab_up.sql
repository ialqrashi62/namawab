-- e140 P0-7 Lab Autoverify UP
-- Tables: lab_results, lab_qc_logs, lab_delta_checks

CREATE TABLE IF NOT EXISTS lab_results (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  result_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  order_id INTEGER,
  test_loinc VARCHAR(20),
  test_name VARCHAR(255),
  value NUMERIC(12,4),
  unit VARCHAR(30),
  reference_low NUMERIC(12,4),
  reference_high NUMERIC(12,4),
  critical_low NUMERIC(12,4),
  critical_high NUMERIC(12,4),
  status VARCHAR(20) DEFAULT 'pending',
  autoverify_status VARCHAR(30),
  verified_by INTEGER,
  verified_at TIMESTAMPTZ,
  collected_at TIMESTAMPTZ,
  resulted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lab_res_tenant ON lab_results(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lab_res_patient ON lab_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_res_status ON lab_results(status);
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lab_res_tenant_isolation ON lab_results;
CREATE POLICY lab_res_tenant_isolation ON lab_results
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS lab_qc_logs (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  log_id VARCHAR(50) UNIQUE NOT NULL,
  test_loinc VARCHAR(20),
  qc_values NUMERIC[],
  mean NUMERIC(12,4),
  sd NUMERIC(12,4),
  violations TEXT[],
  qc_pass BOOLEAN,
  run_by INTEGER,
  run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE lab_qc_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_qc_logs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lab_qc_tenant_isolation ON lab_qc_logs;
CREATE POLICY lab_qc_tenant_isolation ON lab_qc_logs
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS lab_delta_checks (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  test_loinc VARCHAR(20),
  current_value NUMERIC(12,4),
  previous_value NUMERIC(12,4),
  delta_pct NUMERIC(8,2),
  flagged BOOLEAN,
  threshold_pct NUMERIC(6,2) DEFAULT 50,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE lab_delta_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_delta_checks FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lab_delta_tenant_isolation ON lab_delta_checks;
CREATE POLICY lab_delta_tenant_isolation ON lab_delta_checks
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));