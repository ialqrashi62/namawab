-- P3-NB 3.312.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_358 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_358_tenant ON p3x_pcc_auto_gen_358(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_359 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_359_tenant ON p3x_pcc_auto_gen_359(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_360 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_360_tenant ON p3x_pcc_auto_gen_360(tenant_id);