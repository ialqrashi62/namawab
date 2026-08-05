-- P3-LR 3.276.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_250 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_250_tenant ON p3x_pcc_auto_ext_250(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_251 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_251_tenant ON p3x_pcc_auto_ext_251(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_252 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_252_tenant ON p3x_pcc_auto_ext_252(tenant_id);