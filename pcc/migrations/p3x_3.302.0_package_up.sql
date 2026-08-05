-- P3-MR 3.302.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_328 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_328_tenant ON p3x_pcc_auto_ext_328(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_329 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_329_tenant ON p3x_pcc_auto_ext_329(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_330 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_330_tenant ON p3x_pcc_auto_ext_330(tenant_id);