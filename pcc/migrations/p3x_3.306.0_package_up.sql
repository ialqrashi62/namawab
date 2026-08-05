-- P3-MV 3.306.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_340 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_340_tenant ON p3x_pcc_auto_ext_340(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_341 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_341_tenant ON p3x_pcc_auto_ext_341(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_342 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_342_tenant ON p3x_pcc_auto_ext_342(tenant_id);