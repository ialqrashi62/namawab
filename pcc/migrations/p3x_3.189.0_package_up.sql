-- P3-II 3.189.0 package — 3 modules
CREATE TABLE IF NOT EXISTS p3x_pcc_cabg_ext (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_cabg_ext_tenant ON p3x_pcc_cabg_ext(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_valve_surgery (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_valve_surgery_tenant ON p3x_pcc_valve_surgery(tenant_id);
CREATE TABLE IF NOT EXISTS p3x_pcc_aortic_surgery (
  id BIGSERIAL PRIMARY KEY, encounter_id TEXT, tenant_id TEXT NOT NULL,
  input JSONB, result JSONB, module TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), created_by TEXT);
CREATE INDEX IF NOT EXISTS idx_p3x_pcc_aortic_surgery_tenant ON p3x_pcc_aortic_surgery(tenant_id);