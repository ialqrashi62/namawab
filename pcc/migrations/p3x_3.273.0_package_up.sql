-- P3-LO 3.273.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_rad_ext8 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_rad_ext8_tenant ON p3x_pcc_rad_ext8(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_path_ext2 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_path_ext2_tenant ON p3x_pcc_path_ext2(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_path_ext3 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_path_ext3_tenant ON p3x_pcc_path_ext3(tenant_id);