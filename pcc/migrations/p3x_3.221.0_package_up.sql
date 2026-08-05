-- P3-JO 3.221.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_ext20 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_ext20_tenant ON p3x_pcc_pediatric_ext20(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_surg_ext23 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_surg_ext23_tenant ON p3x_pcc_pediatric_surg_ext23(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_surg_ext24 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_surg_ext24_tenant ON p3x_pcc_pediatric_surg_ext24(tenant_id);