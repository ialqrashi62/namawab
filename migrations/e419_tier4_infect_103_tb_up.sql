-- e419 TIER4_INFECT-103 TB
CREATE TABLE IF NOT EXISTS tier4_infect_103_tb_active (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  site TEXT NOT NULL,
  smear TEXT,
  resistance TEXT,
  weight_kg NUMERIC,
  regimen TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_103_tb_active ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_103_tb_active FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_103_tb_active_t ON tier4_infect_103_tb_active;
CREATE POLICY tier4_infect_103_tb_active_t ON tier4_infect_103_tb_active
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_infect_103_tb_ltbi (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  screening_test TEXT,
  high_risk BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_103_tb_ltbi ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_103_tb_ltbi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_103_tb_ltbi_t ON tier4_infect_103_tb_ltbi;
CREATE POLICY tier4_infect_103_tb_ltbi_t ON tier4_infect_103_tb_ltbi
  USING (tenant_id = current_setting('app.tenant_id', true));