-- P3-LU 3.279.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_259 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_259_tenant ON p3x_pcc_auto_ext_259(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_260 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_260_tenant ON p3x_pcc_auto_ext_260(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_261 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_261_tenant ON p3x_pcc_auto_ext_261(tenant_id);