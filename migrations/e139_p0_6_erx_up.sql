-- e139 P0-6 E-Prescription UP
-- Tables: erx_prescriptions, erx_signatures, erx_refills

CREATE TABLE IF NOT EXISTS erx_prescriptions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  rx_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  prescriber_id INTEGER NOT NULL,
  drug_name VARCHAR(255) NOT NULL,
  dose VARCHAR(50),
  frequency VARCHAR(50),
  route VARCHAR(30),
  duration_days INTEGER,
  refills INTEGER DEFAULT 0,
  controlled BOOLEAN DEFAULT false,
  sfda_code VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  electronic_signature_id VARCHAR(80),
  nphies_submitted BOOLEAN DEFAULT false,
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_erx_tenant ON erx_prescriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erx_patient ON erx_prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_erx_status ON erx_prescriptions(status);
ALTER TABLE erx_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE erx_prescriptions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS erx_rx_tenant_isolation ON erx_prescriptions;
CREATE POLICY erx_rx_tenant_isolation ON erx_prescriptions
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS erx_signatures (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  signature_id VARCHAR(80) UNIQUE NOT NULL,
  prescription_id VARCHAR(50),
  prescriber_id INTEGER NOT NULL,
  signature_method VARCHAR(50) DEFAULT 'digital_certificate',
  signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE erx_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE erx_signatures FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS erx_sig_tenant_isolation ON erx_signatures;
CREATE POLICY erx_sig_tenant_isolation ON erx_signatures
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS erx_refills (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  prescription_id VARCHAR(50) NOT NULL,
  refill_number INTEGER NOT NULL,
  filled_at TIMESTAMPTZ,
  pharmacist_id INTEGER,
  status VARCHAR(20) DEFAULT 'pending'
);
ALTER TABLE erx_refills ENABLE ROW LEVEL SECURITY;
ALTER TABLE erx_refills FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS erx_refill_tenant_isolation ON erx_refills;
CREATE POLICY erx_refill_tenant_isolation ON erx_refills
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));