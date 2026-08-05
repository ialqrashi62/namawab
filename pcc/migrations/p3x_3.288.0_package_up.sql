-- P3-MD 3.288.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_286 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_286_tenant ON p3x_pcc_auto_ext_286(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_287 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_287_tenant ON p3x_pcc_auto_ext_287(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_288 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_288_tenant ON p3x_pcc_auto_ext_288(tenant_id);