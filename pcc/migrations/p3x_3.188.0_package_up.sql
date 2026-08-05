-- P3-IH 3.188.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_heart_failure_program (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_heart_failure_program_tenant ON p3x_pcc_heart_failure_program(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_heart_transplant (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_heart_transplant_tenant ON p3x_pcc_heart_transplant(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_ecmo_advanced (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_ecmo_advanced_tenant ON p3x_pcc_ecmo_advanced(tenant_id);