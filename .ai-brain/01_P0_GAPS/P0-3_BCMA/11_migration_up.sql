-- Migration: P0-3_BCMA (UP) — Non-destructive
-- Barcode Medication Administration tables

CREATE TABLE IF NOT EXISTS bcma_mar_entries (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  drug VARCHAR(100) NOT NULL,
  dose VARCHAR(50),
  route VARCHAR(20),
  scheduled_time TIMESTAMPTZ,
  administered_time TIMESTAMPTZ,
  administered_by INTEGER,
  verified_by INTEGER,
  allergies_checked BOOLEAN DEFAULT FALSE,
  interactions_checked BOOLEAN DEFAULT FALSE,
  double_check_required BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'administered',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bcma_mar_tenant ON bcma_mar_entries(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bcma_mar_patient ON bcma_mar_entries(patient_id);
CREATE INDEX IF NOT EXISTS idx_bcma_mar_admin ON bcma_mar_entries(administered_by);
CREATE INDEX IF NOT EXISTS idx_bcma_mar_time ON bcma_mar_entries(administered_time DESC);
ALTER TABLE bcma_mar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bcma_mar_entries FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bcma_mar_tenant_isolation ON bcma_mar_entries;
CREATE POLICY bcma_mar_tenant_isolation ON bcma_mar_entries
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS bcma_overrides (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  drug VARCHAR(100),
  reason VARCHAR(50),
  witness_nurse_id INTEGER,
  provider_approval BOOLEAN DEFAULT FALSE,
  administered_by INTEGER,
  created_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bcma_ovr_tenant ON bcma_overrides(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bcma_ovr_patient ON bcma_overrides(patient_id);
CREATE INDEX IF NOT EXISTS idx_bcma_ovr_reason ON bcma_overrides(reason);
ALTER TABLE bcma_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE bcma_overrides FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bcma_ovr_tenant_isolation ON bcma_overrides;
CREATE POLICY bcma_ovr_tenant_isolation ON bcma_overrides
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS bcma_disposals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  drug VARCHAR(100),
  amount_disposed VARCHAR(50),
  witness_nurse_id INTEGER,
  reason VARCHAR(50),
  administered_by INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bcma_dsp_tenant ON bcma_disposals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bcma_dsp_drug ON bcma_disposals(drug);
ALTER TABLE bcma_disposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bcma_disposals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bcma_dsp_tenant_isolation ON bcma_disposals;
CREATE POLICY bcma_dsp_tenant_isolation ON bcma_disposals
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS bcma_patient_scans (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER NOT NULL,
  wristband_barcode VARCHAR(100),
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scanned_by INTEGER,
  verified BOOLEAN DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_bcma_scan_tenant ON bcma_patient_scans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bcma_scan_patient ON bcma_patient_scans(patient_id);
CREATE INDEX IF NOT EXISTS idx_bcma_scan_time ON bcma_patient_scans(scanned_at DESC);
ALTER TABLE bcma_patient_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bcma_patient_scans FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bcma_scan_tenant_isolation ON bcma_patient_scans;
CREATE POLICY bcma_scan_tenant_isolation ON bcma_patient_scans
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS bcma_drug_scans (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  drug_barcode VARCHAR(100),
  drug_name VARCHAR(100),
  lot_number VARCHAR(50),
  expiry_date DATE,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scanned_by INTEGER
);
CREATE INDEX IF NOT EXISTS idx_bcma_drug_tenant ON bcma_drug_scans(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bcma_drug_name ON bcma_drug_scans(drug_name);
CREATE INDEX IF NOT EXISTS idx_bcma_drug_expiry ON bcma_drug_scans(expiry_date);
ALTER TABLE bcma_drug_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE bcma_drug_scans FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bcma_drug_tenant_isolation ON bcma_drug_scans;
CREATE POLICY bcma_drug_tenant_isolation ON bcma_drug_scans
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));
