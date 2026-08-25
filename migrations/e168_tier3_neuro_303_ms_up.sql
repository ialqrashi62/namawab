-- e168 TIER3_NEURO-303 MS UP
CREATE TABLE IF NOT EXISTS ms_patients (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  ms_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  phenotype VARCHAR(30),
  edss NUMERIC(4,1),
  on_dmt VARCHAR(50),
  neda_status VARCHAR(20),
  last_mri_date DATE,
  last_relapse_date DATE
);
ALTER TABLE ms_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE ms_patients FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ms_p_tenant_isolation ON ms_patients;
CREATE POLICY ms_p_tenant_isolation ON ms_patients
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));