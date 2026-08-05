-- P3-JI 3.215.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext46 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext46_tenant ON p3x_pcc_neuro_ext46(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext47 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext47_tenant ON p3x_pcc_neuro_ext47(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_neuro_ext48 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_neuro_ext48_tenant ON p3x_pcc_neuro_ext48(tenant_id);