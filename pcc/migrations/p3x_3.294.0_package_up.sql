-- P3-MJ 3.294.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_304 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_304_tenant ON p3x_pcc_auto_ext_304(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_305 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_305_tenant ON p3x_pcc_auto_ext_305(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_306 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_306_tenant ON p3x_pcc_auto_ext_306(tenant_id);