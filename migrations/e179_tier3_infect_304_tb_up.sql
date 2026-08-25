-- e179 TIER3_INFECT-304 TB UP
CREATE TABLE IF NOT EXISTS tb_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  classification VARCHAR(30),
  resistance_pattern VARCHAR(30),
  genexpert_result VARCHAR(100),
  regimen VARCHAR(200),
  treatment_phase VARCHAR(20),
  treatment_start DATE
);
ALTER TABLE tb_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tb_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tb_r_tenant_isolation ON tb_records;
CREATE POLICY tb_r_tenant_isolation ON tb_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));