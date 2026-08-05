-- P3-LS 3.277.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_253 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_253_tenant ON p3x_pcc_auto_ext_253(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_254 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_254_tenant ON p3x_pcc_auto_ext_254(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_255 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_255_tenant ON p3x_pcc_auto_ext_255(tenant_id);