-- P3-IG 3.187.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_hypertension_advanced (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_hypertension_advanced_tenant ON p3x_pcc_hypertension_advanced(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_preventive_cardio (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_preventive_cardio_tenant ON p3x_pcc_preventive_cardio(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_women_heart_health (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_women_heart_health_tenant ON p3x_pcc_women_heart_health(tenant_id);