-- P3-LV 3.280.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_262 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_262_tenant ON p3x_pcc_auto_ext_262(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_263 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_263_tenant ON p3x_pcc_auto_ext_263(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_264 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_264_tenant ON p3x_pcc_auto_ext_264(tenant_id);