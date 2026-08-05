-- P3-KL 3.244.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_ent_ext8 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_ent_ext8_tenant ON p3x_pcc_ent_ext8(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_ent_ext9 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_ent_ext9_tenant ON p3x_pcc_ent_ext9(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_ent_ext10 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_ent_ext10_tenant ON p3x_pcc_ent_ext10(tenant_id);