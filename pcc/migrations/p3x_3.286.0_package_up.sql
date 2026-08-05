-- P3-MB 3.286.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_280 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_280_tenant ON p3x_pcc_auto_ext_280(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_281 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_281_tenant ON p3x_pcc_auto_ext_281(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_282 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_282_tenant ON p3x_pcc_auto_ext_282(tenant_id);