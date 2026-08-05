-- P3-MQ 3.301.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_325 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_325_tenant ON p3x_pcc_auto_ext_325(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_326 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_326_tenant ON p3x_pcc_auto_ext_326(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_auto_ext_327 (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_auto_ext_327_tenant ON p3x_pcc_auto_ext_327(tenant_id);