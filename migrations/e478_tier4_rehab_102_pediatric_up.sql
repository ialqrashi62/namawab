-- e478 TIER4_REHAB-102 Pediatric
CREATE TABLE IF NOT EXISTS tier4_rehab_102_ped_gmfcs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_months NUMERIC NOT NULL,
  level TEXT NOT NULL,
  description TEXT,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rehab_102_ped_gmfcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rehab_102_ped_gmfcs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rehab_102_ped_gmfcs_t ON tier4_rehab_102_ped_gmfcs;
CREATE POLICY tier4_rehab_102_ped_gmfcs_t ON tier4_rehab_102_ped_gmfcs
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rehab_102_ped_cp (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_years NUMERIC NOT NULL,
  hand_function TEXT NOT NULL,
  mobility TEXT NOT NULL,
  severity_score NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rehab_102_ped_cp ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rehab_102_ped_cp FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rehab_102_ped_cp_t ON tier4_rehab_102_ped_cp;
CREATE POLICY tier4_rehab_102_ped_cp_t ON tier4_rehab_102_ped_cp
  USING (tenant_id = current_setting('app.tenant_id', true));