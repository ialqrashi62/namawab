-- e187 TIER3_OBGYN-302 Labor UP
CREATE TABLE IF NOT EXISTS labor_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  labor_stage VARCHAR(50),
  fhr_category VARCHAR(10),
  delivery_mode VARCHAR(50),
  estimated_blood_loss_ml INTEGER,
  delivery_date TIMESTAMPTZ
);
ALTER TABLE labor_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE labor_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lab_r_tenant_isolation ON labor_records;
CREATE POLICY lab_r_tenant_isolation ON labor_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));