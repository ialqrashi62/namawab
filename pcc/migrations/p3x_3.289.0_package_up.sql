-- P3-ME 3.289.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_289 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_289_tenant ON p3x_pcc_auto_ext_289(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_290 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_290_tenant ON p3x_pcc_auto_ext_290(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_291 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_291_tenant ON p3x_pcc_auto_ext_291(tenant_id);