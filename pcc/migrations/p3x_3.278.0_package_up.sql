-- P3-LT 3.278.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_256 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_256_tenant ON p3x_pcc_auto_ext_256(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_257 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_257_tenant ON p3x_pcc_auto_ext_257(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_258 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_258_tenant ON p3x_pcc_auto_ext_258(tenant_id);