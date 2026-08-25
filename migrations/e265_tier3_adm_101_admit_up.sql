-- e265 TIER3_ADM-101 Admission Registration UP
CREATE TABLE IF NOT EXISTS adm_admissions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  admission_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  admission_type VARCHAR(30),
  admission_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attending_physician INTEGER,
  diagnosis_at_admission TEXT,
  disposition VARCHAR(30)
);
ALTER TABLE adm_admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_admissions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_a_tenant_isolation ON adm_admissions;
CREATE POLICY adm_a_tenant_isolation ON adm_admissions
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS adm_consent_forms (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  consent_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  consent_type VARCHAR(40),
  interpreter_used VARCHAR(5),
  witness_present VARCHAR(5),
  consent_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  physician_id INTEGER
);
ALTER TABLE adm_consent_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_consent_forms FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_c_tenant_isolation ON adm_consent_forms;
CREATE POLICY adm_c_tenant_isolation ON adm_consent_forms
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));