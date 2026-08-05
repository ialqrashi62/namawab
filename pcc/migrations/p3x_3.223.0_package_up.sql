-- P3-JQ 3.223.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_surg_ext28 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_surg_ext28_tenant ON p3x_pcc_pediatric_surg_ext28(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_surg_ext29 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_surg_ext29_tenant ON p3x_pcc_pediatric_surg_ext29(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_surg_ext30 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_surg_ext30_tenant ON p3x_pcc_pediatric_surg_ext30(tenant_id);