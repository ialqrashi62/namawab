-- P3-JP 3.222.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_surg_ext25 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_surg_ext25_tenant ON p3x_pcc_pediatric_surg_ext25(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_surg_ext26 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_surg_ext26_tenant ON p3x_pcc_pediatric_surg_ext26(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_surg_ext27 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_surg_ext27_tenant ON p3x_pcc_pediatric_surg_ext27(tenant_id);