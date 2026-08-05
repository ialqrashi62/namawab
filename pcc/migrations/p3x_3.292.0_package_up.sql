-- P3-MH 3.292.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_298 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_298_tenant ON p3x_pcc_auto_ext_298(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_299 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_299_tenant ON p3x_pcc_auto_ext_299(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_300 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_300_tenant ON p3x_pcc_auto_ext_300(tenant_id);