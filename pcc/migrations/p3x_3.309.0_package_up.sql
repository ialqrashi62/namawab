-- P3-MY 3.309.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_349 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_349_tenant ON p3x_pcc_auto_ext_349(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_350 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_350_tenant ON p3x_pcc_auto_ext_350(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_351 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_351_tenant ON p3x_pcc_auto_gen_351(tenant_id);