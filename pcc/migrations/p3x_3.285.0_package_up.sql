-- P3-MA 3.285.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_277 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_277_tenant ON p3x_pcc_auto_ext_277(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_278 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_278_tenant ON p3x_pcc_auto_ext_278(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_279 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_279_tenant ON p3x_pcc_auto_ext_279(tenant_id);