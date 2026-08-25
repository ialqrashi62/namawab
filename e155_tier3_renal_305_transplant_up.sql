-- e155 TIER3_RENAL-305 Renal Transplant UP
CREATE TABLE IF NOT EXISTS transplant_donors (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  donor_id VARCHAR(50) UNIQUE NOT NULL,
  age INTEGER,
  kdpi_pct NUMERIC(5,2),
  quality VARCHAR(20),
  hla_typing VARCHAR(50),
  scot_id VARCHAR(50),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE transplant_donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE transplant_donors FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tx_d_tenant_isolation ON transplant_donors;
CREATE POLICY tx_d_tenant_isolation ON transplant_donors
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS transplant_recipients (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  recipient_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  epts NUMERIC(5,2),
  pra_pct NUMERIC(5,2),
  donor_specific_antibody BOOLEAN,
  transplant_date DATE,
  status VARCHAR(20) DEFAULT 'active'
);
ALTER TABLE transplant_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE transplant_recipients FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tx_r_tenant_isolation ON transplant_recipients;
CREATE POLICY tx_r_tenant_isolation ON transplant_recipients
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS transplant_drug_levels (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  log_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  drug VARCHAR(30),
  level NUMERIC(8,2),
  in_range BOOLEAN,
  adjustment VARCHAR(20),
  measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE transplant_drug_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE transplant_drug_levels FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tx_dl_tenant_isolation ON transplant_drug_levels;
CREATE POLICY tx_dl_tenant_isolation ON transplant_drug_levels
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));