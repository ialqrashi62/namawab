-- e184 TIER3_MUSK-304 Trauma UP
CREATE TABLE IF NOT EXISTS fracture_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  fracture_type VARCHAR(50),
  gustilo_grade VARCHAR(20),
  tlics_score INTEGER,
  time_to_surgery_hours INTEGER,
  fixation_type VARCHAR(50),
  admitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE fracture_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fracture_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS fx_r_tenant_isolation ON fracture_records;
CREATE POLICY fx_r_tenant_isolation ON fracture_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));