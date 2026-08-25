-- e142 P0-9 Immunization Registry UP
-- Tables: imm_vaccines, imm_doses, imm_aefi, imm_coldchain

CREATE TABLE IF NOT EXISTS imm_vaccines (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  vaccine_code VARCHAR(30) NOT NULL,
  vaccine_name VARCHAR(255) NOT NULL,
  moh_scheduled_ages TEXT[],
  contraindications TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, vaccine_code)
);
ALTER TABLE imm_vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE imm_vaccines FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS imm_vac_tenant_isolation ON imm_vaccines;
CREATE POLICY imm_vac_tenant_isolation ON imm_vaccines
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS imm_doses (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  dose_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  vaccine_code VARCHAR(30) NOT NULL,
  dose_number INTEGER DEFAULT 1,
  lot_number VARCHAR(50),
  administered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  administered_by INTEGER,
  site VARCHAR(50),
  route VARCHAR(30),
  age_at_dose_months INTEGER
);
CREATE INDEX IF NOT EXISTS idx_imm_doses_tenant ON imm_doses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_imm_doses_patient ON imm_doses(patient_id);
ALTER TABLE imm_doses ENABLE ROW LEVEL SECURITY;
ALTER TABLE imm_doses FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS imm_doses_tenant_isolation ON imm_doses;
CREATE POLICY imm_doses_tenant_isolation ON imm_doses
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS imm_aefi (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  report_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  vaccine VARCHAR(100),
  lot_number VARCHAR(50),
  adverse_event TEXT,
  severity VARCHAR(30),
  onset_hours INTEGER,
  serious BOOLEAN,
  follow_up_required BOOLEAN,
  reported_by INTEGER,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE imm_aefi ENABLE ROW LEVEL SECURITY;
ALTER TABLE imm_aefi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS imm_aefi_tenant_isolation ON imm_aefi;
CREATE POLICY imm_aefi_tenant_isolation ON imm_aefi
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS imm_coldchain (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  log_id VARCHAR(50) UNIQUE NOT NULL,
  lot_number VARCHAR(50) NOT NULL,
  storage_temp_c NUMERIC(5,2),
  min_temp_c NUMERIC(5,2),
  max_temp_c NUMERIC(5,2),
  excursion BOOLEAN,
  action VARCHAR(50),
  logged_by INTEGER,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE imm_coldchain ENABLE ROW LEVEL SECURITY;
ALTER TABLE imm_coldchain FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS imm_cc_tenant_isolation ON imm_coldchain;
CREATE POLICY imm_cc_tenant_isolation ON imm_coldchain
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));