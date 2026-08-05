-- P3-MG 3.291.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_295 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_295_tenant ON p3x_pcc_auto_ext_295(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_296 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_296_tenant ON p3x_pcc_auto_ext_296(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_297 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_297_tenant ON p3x_pcc_auto_ext_297(tenant_id);