-- P3-MZ 3.310.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_352 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_352_tenant ON p3x_pcc_auto_gen_352(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_353 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_353_tenant ON p3x_pcc_auto_gen_353(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_354 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_354_tenant ON p3x_pcc_auto_gen_354(tenant_id);