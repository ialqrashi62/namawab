-- P3-MS 3.303.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_331 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_331_tenant ON p3x_pcc_auto_ext_331(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_332 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_332_tenant ON p3x_pcc_auto_ext_332(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_333 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_333_tenant ON p3x_pcc_auto_ext_333(tenant_id);