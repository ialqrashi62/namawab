-- e274 TIER3_ADM-110 Regulatory / Compliance UP
CREATE TABLE IF NOT EXISTS adm_regulatory_status (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  status_id VARCHAR(50) UNIQUE NOT NULL,
  license_type VARCHAR(40),
  license_status VARCHAR(20),
  expiry_date DATE,
  renewal_required VARCHAR(5),
  last_inspection_date DATE,
  findings_open INTEGER
);
ALTER TABLE adm_regulatory_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_regulatory_status FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_rg_tenant_isolation ON adm_regulatory_status;
CREATE POLICY adm_rg_tenant_isolation ON adm_regulatory_status
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS adm_contracts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  contract_id VARCHAR(50) UNIQUE NOT NULL,
  contract_type VARCHAR(40),
  counterparty VARCHAR(80),
  effective_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  annual_review_due DATE,
  status VARCHAR(20)
);
ALTER TABLE adm_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_contracts FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_ct_tenant_isolation ON adm_contracts;
CREATE POLICY adm_ct_tenant_isolation ON adm_contracts
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));