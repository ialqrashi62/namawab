-- P3-JN 3.220.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_ext17 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_ext17_tenant ON p3x_pcc_pediatric_ext17(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_ext18 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_ext18_tenant ON p3x_pcc_pediatric_ext18(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_ext19 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_ext19_tenant ON p3x_pcc_pediatric_ext19(tenant_id);