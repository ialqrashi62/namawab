-- e180 TIER3_INFECT-305 Tropical UP
CREATE TABLE IF NOT EXISTS tropical_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  diagnosis VARCHAR(50),
  severity VARCHAR(30),
  treatment_plan TEXT,
  travel_history TEXT,
  prophylaxis_given VARCHAR(200),
  diagnosed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tropical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tropical_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS trop_r_tenant_isolation ON tropical_records;
CREATE POLICY trop_r_tenant_isolation ON tropical_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));