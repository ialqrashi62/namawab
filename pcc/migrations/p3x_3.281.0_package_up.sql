-- P3-LW 3.281.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_265 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_265_tenant ON p3x_pcc_auto_ext_265(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_266 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_266_tenant ON p3x_pcc_auto_ext_266(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_267 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_267_tenant ON p3x_pcc_auto_ext_267(tenant_id);