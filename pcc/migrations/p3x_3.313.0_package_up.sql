-- P3-NC 3.313.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_361 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_361_tenant ON p3x_pcc_auto_gen_361(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_362 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_362_tenant ON p3x_pcc_auto_gen_362(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_363 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_363_tenant ON p3x_pcc_auto_gen_363(tenant_id);