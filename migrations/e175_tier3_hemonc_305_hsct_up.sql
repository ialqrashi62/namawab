-- e175 TIER3_HEMONC-305 HSCT UP
CREATE TABLE IF NOT EXISTS hsct_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  transplant_type VARCHAR(20),
  donor_type VARCHAR(30),
  hla_mismatch_count INTEGER,
  conditioning_regimen VARCHAR(100),
  gvhd_prophylaxis VARCHAR(100),
  engraftment_day INTEGER,
  status VARCHAR(20) DEFAULT 'pending',
  transplant_date DATE
);
ALTER TABLE hsct_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE hsct_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hsct_r_tenant_isolation ON hsct_records;
CREATE POLICY hsct_r_tenant_isolation ON hsct_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));