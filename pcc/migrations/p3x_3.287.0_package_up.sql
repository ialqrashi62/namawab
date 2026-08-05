-- P3-MC 3.287.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_283 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_283_tenant ON p3x_pcc_auto_ext_283(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_284 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_284_tenant ON p3x_pcc_auto_ext_284(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_285 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_285_tenant ON p3x_pcc_auto_ext_285(tenant_id);