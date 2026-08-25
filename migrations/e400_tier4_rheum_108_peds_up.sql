-- e400 TIER4_RHEUM-108 Pediatric Rheumatology
CREATE TABLE IF NOT EXISTS tier4_rheum_108_peds_kd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_years INT NOT NULL,
  fever_days INT NOT NULL,
  classic_features INT NOT NULL,
  classification TEXT,
  therapy TEXT,
  echo_timing TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_108_peds_kd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_108_peds_kd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_108_peds_kd_t ON tier4_rheum_108_peds_kd;
CREATE POLICY tier4_rheum_108_peds_kd_t ON tier4_rheum_108_peds_kd
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rheum_108_peds_jia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  subtype TEXT,
  active_joints INT,
  therapy TEXT,
  uveitis_screening TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_108_peds_jia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_108_peds_jia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_108_peds_jia_t ON tier4_rheum_108_peds_jia;
CREATE POLICY tier4_rheum_108_peds_jia_t ON tier4_rheum_108_peds_jia
  USING (tenant_id = current_setting('app.tenant_id', true));