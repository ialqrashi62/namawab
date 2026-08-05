-- P3-IJ 3.190.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_cardiac_mri (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_cardiac_mri_tenant ON p3x_pcc_cardiac_mri(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_cardiac_ct (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_cardiac_ct_tenant ON p3x_pcc_cardiac_ct(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_echo_advanced (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_echo_advanced_tenant ON p3x_pcc_echo_advanced(tenant_id);