-- P3-JX 3.230.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_neuro_ext18 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_neuro_ext18_tenant ON p3x_pcc_pediatric_neuro_ext18(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_neuro_ext19 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_neuro_ext19_tenant ON p3x_pcc_pediatric_neuro_ext19(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_surg_ext4 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_surg_ext4_tenant ON p3x_pcc_surg_ext4(tenant_id);