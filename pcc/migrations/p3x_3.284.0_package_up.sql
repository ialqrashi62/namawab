-- P3-LZ 3.284.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_274 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_274_tenant ON p3x_pcc_auto_ext_274(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_275 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_275_tenant ON p3x_pcc_auto_ext_275(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_276 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_276_tenant ON p3x_pcc_auto_ext_276(tenant_id);