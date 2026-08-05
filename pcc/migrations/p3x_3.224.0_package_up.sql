-- P3-JR 3.224.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_surg_ext31 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_surg_ext31_tenant ON p3x_pcc_pediatric_surg_ext31(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_surg_ext32 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_surg_ext32_tenant ON p3x_pcc_pediatric_surg_ext32(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_surg_ext33 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_surg_ext33_tenant ON p3x_pcc_pediatric_surg_ext33(tenant_id);