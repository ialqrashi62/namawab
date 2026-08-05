-- P3-KS 3.251.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_rehab_ext9 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_rehab_ext9_tenant ON p3x_pcc_rehab_ext9(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_rehab_ext10 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_rehab_ext10_tenant ON p3x_pcc_rehab_ext10(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pain_ext3 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pain_ext3_tenant ON p3x_pcc_pain_ext3(tenant_id);