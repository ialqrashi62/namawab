-- P3-IL 3.192.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_sleep_medicine_advanced (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_sleep_medicine_advanced_tenant ON p3x_pcc_sleep_medicine_advanced(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_respiratory_failure (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_respiratory_failure_tenant ON p3x_pcc_respiratory_failure(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_osa_advanced (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_osa_advanced_tenant ON p3x_pcc_osa_advanced(tenant_id);