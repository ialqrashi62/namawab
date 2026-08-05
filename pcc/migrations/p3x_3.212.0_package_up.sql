-- P3-JF 3.212.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext37 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext37_tenant ON p3x_pcc_neuro_ext37(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext38 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext38_tenant ON p3x_pcc_neuro_ext38(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext39 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext39_tenant ON p3x_pcc_neuro_ext39(tenant_id);