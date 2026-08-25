-- e189 TIER3_OBGYN-304 GynOnc UP
CREATE TABLE IF NOT EXISTS gynonc_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  cancer_type VARCHAR(30),
  figo_stage VARCHAR(30),
  rmi_score NUMERIC(8,2),
  screening_result VARCHAR(50),
  treatment_plan TEXT,
  diagnosed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE gynonc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE gynonc_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gno_r_tenant_isolation ON gynonc_records;
CREATE POLICY gno_r_tenant_isolation ON gynonc_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));