-- P3-NE 3.315.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_367 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_367_tenant ON p3x_pcc_auto_gen_367(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_368 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_368_tenant ON p3x_pcc_auto_gen_368(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_gen_369 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_gen_369_tenant ON p3x_pcc_auto_gen_369(tenant_id);