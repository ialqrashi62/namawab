-- P3-MO 3.299.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_319 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_319_tenant ON p3x_pcc_auto_ext_319(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_320 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_320_tenant ON p3x_pcc_auto_ext_320(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_321 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_321_tenant ON p3x_pcc_auto_ext_321(tenant_id);