-- e417 TIER4_INFECT-101 General ID (Sepsis/FUO)
CREATE TABLE IF NOT EXISTS tier4_infect_101_general_sepsis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  lactate NUMERIC NOT NULL,
  mean_arterial_pressure NUMERIC NOT NULL,
  source TEXT,
  sepsis TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_101_general_sepsis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_101_general_sepsis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_101_general_sepsis_t ON tier4_infect_101_general_sepsis;
CREATE POLICY tier4_infect_101_general_sepsis_t ON tier4_infect_101_general_sepsis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_infect_101_general_fuo (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  fever_days INT,
  travel_history BOOLEAN,
  hiv_status TEXT,
  immunocompromised BOOLEAN,
  category TEXT,
  workup TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_101_general_fuo ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_101_general_fuo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_101_general_fuo_t ON tier4_infect_101_general_fuo;
CREATE POLICY tier4_infect_101_general_fuo_t ON tier4_infect_101_general_fuo
  USING (tenant_id = current_setting('app.tenant_id', true));