-- P3-LY 3.283.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_271 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_271_tenant ON p3x_pcc_auto_ext_271(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_272 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_272_tenant ON p3x_pcc_auto_ext_272(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_273 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_273_tenant ON p3x_pcc_auto_ext_273(tenant_id);