-- P3-MW 3.307.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_343 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_343_tenant ON p3x_pcc_auto_ext_343(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_344 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_344_tenant ON p3x_pcc_auto_ext_344(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_345 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_345_tenant ON p3x_pcc_auto_ext_345(tenant_id);