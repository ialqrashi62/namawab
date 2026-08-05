-- P3-MK 3.295.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_307 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_307_tenant ON p3x_pcc_auto_ext_307(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_308 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_308_tenant ON p3x_pcc_auto_ext_308(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_309 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_309_tenant ON p3x_pcc_auto_ext_309(tenant_id);