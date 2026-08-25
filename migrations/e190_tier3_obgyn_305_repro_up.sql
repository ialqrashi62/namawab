-- e190 TIER3_OBGYN-305 Reproductive UP
CREATE TABLE IF NOT EXISTS reproductive_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  diagnosis VARCHAR(50),
  amh_value NUMERIC(5,2),
  pcos_diagnosed BOOLEAN,
  ivf_protocol VARCHAR(100),
  semen_analysis_result VARCHAR(100),
  treatment_plan TEXT,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE reproductive_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reproductive_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rep_r_tenant_isolation ON reproductive_records;
CREATE POLICY rep_r_tenant_isolation ON reproductive_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));