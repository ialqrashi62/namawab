-- P3-MI 3.293.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_301 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_301_tenant ON p3x_pcc_auto_ext_301(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_302 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_302_tenant ON p3x_pcc_auto_ext_302(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_303 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_303_tenant ON p3x_pcc_auto_ext_303(tenant_id);