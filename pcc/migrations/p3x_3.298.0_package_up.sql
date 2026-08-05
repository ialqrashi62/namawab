-- P3-MN 3.298.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_316 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_316_tenant ON p3x_pcc_auto_ext_316(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_317 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_317_tenant ON p3x_pcc_auto_ext_317(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_318 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_318_tenant ON p3x_pcc_auto_ext_318(tenant_id);