-- P3-JJ 3.216.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext49 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext49_tenant ON p3x_pcc_neuro_ext49(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext50 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext50_tenant ON p3x_pcc_neuro_ext50(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pediatric_ext7 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pediatric_ext7_tenant ON p3x_pcc_pediatric_ext7(tenant_id);