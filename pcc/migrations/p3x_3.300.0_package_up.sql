-- P3-MP 3.300.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_322 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_322_tenant ON p3x_pcc_auto_ext_322(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_323 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_323_tenant ON p3x_pcc_auto_ext_323(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_324 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_324_tenant ON p3x_pcc_auto_ext_324(tenant_id);