-- e186 TIER3_OBGYN-301 ANC UP
CREATE TABLE IF NOT EXISTS anc_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  gravida INTEGER,
  para INTEGER,
  edd DATE,
  risk_level VARCHAR(20),
  high_risk_referral VARCHAR(200),
  visit_count INTEGER DEFAULT 0,
  last_visit_date DATE
);
ALTER TABLE anc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE anc_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anc_r_tenant_isolation ON anc_records;
CREATE POLICY anc_r_tenant_isolation ON anc_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));