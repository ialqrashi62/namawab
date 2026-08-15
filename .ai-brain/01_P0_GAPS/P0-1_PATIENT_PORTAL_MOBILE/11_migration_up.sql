-- Migration: P0-1_PATIENT_PORTAL_MOBILE (UP)
-- Patient Portal Mobile tables

CREATE TABLE IF NOT EXISTS pp_appointments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  facility_id INTEGER NOT NULL,
  specialty VARCHAR(50),
  appointment_date DATE,
  appointment_time VARCHAR(10),
  status VARCHAR(20) DEFAULT 'confirmed',
  appointment_id VARCHAR(50) UNIQUE,
  insurance_approved BOOLEAN DEFAULT FALSE,
  cost NUMERIC(8,2),
  teleconsult_url VARCHAR(255),
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pp_appts_tenant ON pp_appointments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pp_appts_patient ON pp_appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_pp_appts_date ON pp_appointments(appointment_date);
ALTER TABLE pp_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pp_appointments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pp_appts_tenant_isolation ON pp_appointments;
CREATE POLICY pp_appts_tenant_isolation ON pp_appointments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pp_vitals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  type VARCHAR(30),
  value NUMERIC(10,2),
  unit VARCHAR(20),
  abnormal BOOLEAN DEFAULT FALSE,
  measured_at TIMESTAMPTZ,
  source VARCHAR(20) DEFAULT 'self_reported',
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pp_vitals_tenant ON pp_vitals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pp_vitals_patient ON pp_vitals(patient_id);
CREATE INDEX IF NOT EXISTS idx_pp_vitals_measured ON pp_vitals(measured_at DESC);
ALTER TABLE pp_vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pp_vitals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pp_vitals_tenant_isolation ON pp_vitals;
CREATE POLICY pp_vitals_tenant_isolation ON pp_vitals
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pp_refill_requests (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  prescription_id INTEGER,
  status VARCHAR(20) DEFAULT 'pending',
  approved_by INTEGER,
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_pp_refill_tenant ON pp_refill_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pp_refill_patient ON pp_refill_requests(patient_id);
ALTER TABLE pp_refill_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE pp_refill_requests FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pp_refill_tenant_isolation ON pp_refill_requests;
CREATE POLICY pp_refill_tenant_isolation ON pp_refill_requests
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pp_caregivers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  caregiver_national_id VARCHAR(20) NOT NULL,
  relationship VARCHAR(30),
  consent_doc_id VARCHAR(50) NOT NULL,
  expires_at DATE,
  active BOOLEAN DEFAULT TRUE,
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pp_caregiver_tenant ON pp_caregivers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pp_caregiver_patient ON pp_caregivers(patient_id);
ALTER TABLE pp_caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pp_caregivers FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pp_caregiver_tenant_isolation ON pp_caregivers;
CREATE POLICY pp_caregiver_tenant_isolation ON pp_caregivers
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pp_consent_log (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  withdrawal_type VARCHAR(50),
  effective_at TIMESTAMPTZ,
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_pp_consent_tenant ON pp_consent_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pp_consent_patient ON pp_consent_log(patient_id);
ALTER TABLE pp_consent_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE pp_consent_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pp_consent_tenant_isolation ON pp_consent_log;
CREATE POLICY pp_consent_tenant_isolation ON pp_consent_log
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));
