-- P3-ND 3.314.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_364 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_364_tenant ON p3x_pcc_auto_gen_364(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_365 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_365_tenant ON p3x_pcc_auto_gen_365(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_366 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_366_tenant ON p3x_pcc_auto_gen_366(tenant_id);