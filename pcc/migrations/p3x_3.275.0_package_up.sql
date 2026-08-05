-- P3-LQ 3.275.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_247 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_247_tenant ON p3x_pcc_auto_ext_247(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_248 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_248_tenant ON p3x_pcc_auto_ext_248(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_249 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_249_tenant ON p3x_pcc_auto_ext_249(tenant_id);