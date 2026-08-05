-- P3-ID 3.184.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_advanced_heart_failure (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_advanced_heart_failure_tenant ON p3x_pcc_advanced_heart_failure(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_pulmonary_hypertension (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_pulmonary_hypertension_tenant ON p3x_pcc_pulmonary_hypertension(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_cardiac_rehab_ext (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_cardiac_rehab_ext_tenant ON p3x_pcc_cardiac_rehab_ext(tenant_id);