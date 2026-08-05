-- P3-LE 3.263.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_trauma_ext6 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_trauma_ext6_tenant ON p3x_pcc_trauma_ext6(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_icu_ext4 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_icu_ext4_tenant ON p3x_pcc_icu_ext4(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_icu_ext5 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_icu_ext5_tenant ON p3x_pcc_icu_ext5(tenant_id);