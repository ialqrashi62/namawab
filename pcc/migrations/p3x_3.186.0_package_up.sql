-- P3-IF 3.186.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_aortic_intervention (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_aortic_intervention_tenant ON p3x_pcc_aortic_intervention(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_peripheral_vascular (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_peripheral_vascular_tenant ON p3x_pcc_peripheral_vascular(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_venous_thromboembolism (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_venous_thromboembolism_tenant ON p3x_pcc_venous_thromboembolism(tenant_id);