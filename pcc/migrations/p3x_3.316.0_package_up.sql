-- P3-NF 3.316.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_370 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_370_tenant ON p3x_pcc_auto_gen_370(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_371 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_371_tenant ON p3x_pcc_auto_gen_371(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_372 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_372_tenant ON p3x_pcc_auto_gen_372(tenant_id);