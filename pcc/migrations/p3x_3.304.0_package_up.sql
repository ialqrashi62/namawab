-- P3-MT 3.304.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_334 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_334_tenant ON p3x_pcc_auto_ext_334(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_335 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_335_tenant ON p3x_pcc_auto_ext_335(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_336 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_336_tenant ON p3x_pcc_auto_ext_336(tenant_id);