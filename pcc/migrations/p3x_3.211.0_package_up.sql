-- P3-JE 3.211.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_onco_ext10 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_onco_ext10_tenant ON p3x_pcc_onco_ext10(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext35 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext35_tenant ON p3x_pcc_neuro_ext35(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext36 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext36_tenant ON p3x_pcc_neuro_ext36(tenant_id);