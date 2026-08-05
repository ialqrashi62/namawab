-- P3-JG 3.213.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext40 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext40_tenant ON p3x_pcc_neuro_ext40(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext41 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext41_tenant ON p3x_pcc_neuro_ext41(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext42 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext42_tenant ON p3x_pcc_neuro_ext42(tenant_id);