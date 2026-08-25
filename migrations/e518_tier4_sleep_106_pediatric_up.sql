-- e518 TIER4_SLEEP-106 Pediatric
CREATE TABLE IF NOT EXISTS tier4_sleep_106_ped_needs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_years NUMERIC NOT NULL,
  recommended_hours NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_sleep_106_ped_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_sleep_106_ped_needs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_sleep_106_ped_needs_t ON tier4_sleep_106_ped_needs;
CREATE POLICY tier4_sleep_106_ped_needs_t ON tier4_sleep_106_ped_needs
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_sleep_106_ped_osa (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_years NUMERIC NOT NULL,
  snoring BOOLEAN,
  adenoid_facies BOOLEAN,
  obesity BOOLEAN,
  nocturnal_enuresis BOOLEAN,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_sleep_106_ped_osa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_sleep_106_ped_osa FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_sleep_106_ped_osa_t ON tier4_sleep_106_ped_osa;
CREATE POLICY tier4_sleep_106_ped_osa_t ON tier4_sleep_106_ped_osa
  USING (tenant_id = current_setting('app.tenant_id', true));