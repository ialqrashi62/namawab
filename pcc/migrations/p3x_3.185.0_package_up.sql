-- P3-IE 3.185.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_valvular_intervention (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_valvular_intervention_tenant ON p3x_pcc_valvular_intervention(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_arrhythmia_advanced (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_arrhythmia_advanced_tenant ON p3x_pcc_arrhythmia_advanced(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_lipidology (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_lipidology_tenant ON p3x_pcc_lipidology(tenant_id);