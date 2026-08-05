-- P3-JV 3.228.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_neuro_ext12 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_neuro_ext12_tenant ON p3x_pcc_pediatric_neuro_ext12(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_neuro_ext13 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_neuro_ext13_tenant ON p3x_pcc_pediatric_neuro_ext13(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_neuro_ext14 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_neuro_ext14_tenant ON p3x_pcc_pediatric_neuro_ext14(tenant_id);