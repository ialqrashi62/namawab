-- P3-MU 3.305.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_337 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_337_tenant ON p3x_pcc_auto_ext_337(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_338 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_338_tenant ON p3x_pcc_auto_ext_338(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_339 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_339_tenant ON p3x_pcc_auto_ext_339(tenant_id);