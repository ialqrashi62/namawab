-- e268 TIER3_ADM-104 Discharge Planning UP
CREATE TABLE IF NOT EXISTS adm_discharges (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  discharge_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  discharge_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  disposition VARCHAR(40),
  primary_diagnosis TEXT,
  hospital_course TEXT,
  condition_at_discharge VARCHAR(30),
  discharging_physician INTEGER
);
ALTER TABLE adm_discharges ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_discharges FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_dc_tenant_isolation ON adm_discharges;
CREATE POLICY adm_dc_tenant_isolation ON adm_discharges
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS adm_follow_up_appointments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  appointment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  appointment_type VARCHAR(40),
  specialty VARCHAR(40),
  scheduled_date DATE NOT NULL,
  provider_id INTEGER,
  notes TEXT
);
ALTER TABLE adm_follow_up_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_follow_up_appointments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_fu_tenant_isolation ON adm_follow_up_appointments;
CREATE POLICY adm_fu_tenant_isolation ON adm_follow_up_appointments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));