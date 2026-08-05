-- P3-LD 3.262.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_trauma_ext3 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_trauma_ext3_tenant ON p3x_pcc_trauma_ext3(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_trauma_ext4 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_trauma_ext4_tenant ON p3x_pcc_trauma_ext4(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_trauma_ext5 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_trauma_ext5_tenant ON p3x_pcc_trauma_ext5(tenant_id);