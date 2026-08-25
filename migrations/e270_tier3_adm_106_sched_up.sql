-- e270 TIER3_ADM-106 Scheduling / Appointments UP
CREATE TABLE IF NOT EXISTS adm_appointments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  appointment_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  provider_id INTEGER,
  appointment_type VARCHAR(40),
  appointment_date TIMESTAMPTZ NOT NULL,
  duration_min INTEGER,
  status VARCHAR(20),
  visit_mode VARCHAR(20),
  no_show VARCHAR(5)
);
ALTER TABLE adm_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_appointments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_ap_tenant_isolation ON adm_appointments;
CREATE POLICY adm_ap_tenant_isolation ON adm_appointments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS adm_waitlist (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  waitlist_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  specialty_requested VARCHAR(40),
  added_date DATE NOT NULL,
  priority VARCHAR(20),
  clinical_priority VARCHAR(20),
  status VARCHAR(20)
);
ALTER TABLE adm_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_waitlist FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_wl_tenant_isolation ON adm_waitlist;
CREATE POLICY adm_wl_tenant_isolation ON adm_waitlist
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));