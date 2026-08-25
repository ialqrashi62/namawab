-- e167 TIER3_NEURO-302 Epilepsy UP
CREATE TABLE IF NOT EXISTS epilepsy_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  seizure_type VARCHAR(50),
  on_aed VARCHAR(50),
  last_seizure_date DATE,
  driving_eligible BOOLEAN,
  pregnancy_aed_check BOOLEAN,
  status_epilepticus BOOLEAN
);
ALTER TABLE epilepsy_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE epilepsy_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS epi_r_tenant_isolation ON epilepsy_records;
CREATE POLICY epi_r_tenant_isolation ON epilepsy_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));