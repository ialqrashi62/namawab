-- e185 TIER3_MUSK-305 Hand UP
CREATE TABLE IF NOT EXISTS hand_records (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  record_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  injury_type VARCHAR(50),
    sunderland_grade VARCHAR(30),
  zone VARCHAR(10),
  replantation_indicated BOOLEAN,
  surgery_date DATE,
  admitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE hand_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE hand_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hand_r_tenant_isolation ON hand_records;
CREATE POLICY hand_r_tenant_isolation ON hand_records
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));