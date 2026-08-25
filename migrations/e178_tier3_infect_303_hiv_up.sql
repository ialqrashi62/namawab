-- e178 TIER3_INFECT-303 HIV UP
CREATE TABLE IF NOT EXISTS hiv_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  cd4_count INTEGER,
  viral_load NUMERIC(10,4),
  art_regimen VARCHAR(100),
  prep_status VARCHAR(20),
  diagnosed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE hiv_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiv_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hiv_r_tenant_isolation ON hiv_records;
CREATE POLICY hiv_r_tenant_isolation ON hiv_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));