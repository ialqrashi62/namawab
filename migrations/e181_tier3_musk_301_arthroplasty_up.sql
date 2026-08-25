-- e181 TIER3_MUSK-301 Arthroplasty UP
CREATE TABLE IF NOT EXISTS arthroplasty_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  procedure_type VARCHAR(20),
  hoos_koos_score NUMERIC(5,2),
  preop_optimization_completed BOOLEAN,
  vte_prophylaxis_regimen VARCHAR(100),
  surgery_date DATE
);
ALTER TABLE arthroplasty_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE arthroplasty_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS art_r_tenant_isolation ON arthroplasty_records;
CREATE POLICY art_r_tenant_isolation ON arthroplasty_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));