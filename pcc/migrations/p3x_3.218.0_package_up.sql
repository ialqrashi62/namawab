-- P3-JL 3.218.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_ext11 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_ext11_tenant ON p3x_pcc_pediatric_ext11(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_ext12 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_ext12_tenant ON p3x_pcc_pediatric_ext12(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_ext13 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_ext13_tenant ON p3x_pcc_pediatric_ext13(tenant_id);