-- P3-MF 3.290.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_292 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_292_tenant ON p3x_pcc_auto_ext_292(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_293 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_293_tenant ON p3x_pcc_auto_ext_293(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_294 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_294_tenant ON p3x_pcc_auto_ext_294(tenant_id);