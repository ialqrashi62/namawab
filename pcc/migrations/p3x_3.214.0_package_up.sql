-- P3-JH 3.214.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext43 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext43_tenant ON p3x_pcc_neuro_ext43(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext44 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext44_tenant ON p3x_pcc_neuro_ext44(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext45 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext45_tenant ON p3x_pcc_neuro_ext45(tenant_id);