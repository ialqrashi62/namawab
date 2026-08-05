-- P3-LA 3.259.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_rare_ext3 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_rare_ext3_tenant ON p3x_pcc_rare_ext3(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_rare_ext4 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_rare_ext4_tenant ON p3x_pcc_rare_ext4(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_rare_ext5 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_rare_ext5_tenant ON p3x_pcc_rare_ext5(tenant_id);