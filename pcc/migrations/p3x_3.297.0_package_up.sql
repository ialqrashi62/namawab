-- P3-MM 3.297.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_313 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_313_tenant ON p3x_pcc_auto_ext_313(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_314 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_314_tenant ON p3x_pcc_auto_ext_314(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_315 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_315_tenant ON p3x_pcc_auto_ext_315(tenant_id);