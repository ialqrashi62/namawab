-- P3-JT 3.226.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_neuro_ext6 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_neuro_ext6_tenant ON p3x_pcc_pediatric_neuro_ext6(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_neuro_ext7 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_neuro_ext7_tenant ON p3x_pcc_pediatric_neuro_ext7(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_neuro_ext8 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_neuro_ext8_tenant ON p3x_pcc_pediatric_neuro_ext8(tenant_id);