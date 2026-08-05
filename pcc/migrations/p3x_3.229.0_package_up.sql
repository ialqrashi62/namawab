-- P3-JW 3.229.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_neuro_ext15 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_neuro_ext15_tenant ON p3x_pcc_pediatric_neuro_ext15(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_neuro_ext16 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_neuro_ext16_tenant ON p3x_pcc_pediatric_neuro_ext16(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_neuro_ext17 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_neuro_ext17_tenant ON p3x_pcc_pediatric_neuro_ext17(tenant_id);