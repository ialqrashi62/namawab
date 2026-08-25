-- e158 TIER3_GI-303 Hepatitis UP
CREATE TABLE IF NOT EXISTS hepatitis_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  virus_type VARCHAR(10),
  genotype VARCHAR(10),
  viral_load NUMERIC(12,4),
  phase VARCHAR(50),
  treatment_regimen TEXT,
  duration_weeks INTEGER,
  treatment_start DATE
);
ALTER TABLE hepatitis_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE hepatitis_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hep_r_tenant_isolation ON hepatitis_records;
CREATE POLICY hep_r_tenant_isolation ON hepatitis_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));