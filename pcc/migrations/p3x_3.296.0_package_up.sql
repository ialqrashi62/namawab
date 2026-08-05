-- P3-ML 3.296.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_310 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_310_tenant ON p3x_pcc_auto_ext_310(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_311 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_311_tenant ON p3x_pcc_auto_ext_311(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_312 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_312_tenant ON p3x_pcc_auto_ext_312(tenant_id);