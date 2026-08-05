-- P3-LX 3.282.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_268 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_268_tenant ON p3x_pcc_auto_ext_268(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_269 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_269_tenant ON p3x_pcc_auto_ext_269(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_270 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_270_tenant ON p3x_pcc_auto_ext_270(tenant_id);