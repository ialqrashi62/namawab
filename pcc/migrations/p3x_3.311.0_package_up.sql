-- P3-NA 3.311.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_355 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_355_tenant ON p3x_pcc_auto_gen_355(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_356 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_356_tenant ON p3x_pcc_auto_gen_356(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_357 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_357_tenant ON p3x_pcc_auto_gen_357(tenant_id);