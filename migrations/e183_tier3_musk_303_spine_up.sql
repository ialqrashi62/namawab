-- e183 TIER3_MUSK-303 Spine UP
CREATE TABLE IF NOT EXISTS spine_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  diagnosis VARCHAR(50),
  odi_score NUMERIC(5,2),
  tlics_score INTEGER,
  surgical_indicated BOOLEAN,
  surgery_date DATE
);
ALTER TABLE spine_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE spine_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS spine_r_tenant_isolation ON spine_records;
CREATE POLICY spine_r_tenant_isolation ON spine_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));