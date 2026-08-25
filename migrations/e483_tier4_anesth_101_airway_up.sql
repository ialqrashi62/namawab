-- e483 TIER4_ANESTH-101 Airway
CREATE TABLE IF NOT EXISTS tier4_anesth_101_airway_assessment (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  mallampati NUMERIC NOT NULL,
  mouth_opening_cm NUMERIC NOT NULL,
  thyromental_distance_cm NUMERIC NOT NULL,
  neck_mobility TEXT NOT NULL,
  obesity BOOLEAN,
  prior_difficult BOOLEAN,
  risk TEXT,
  plan TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_anesth_101_airway_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_anesth_101_airway_assessment FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_anesth_101_airway_assessment_t ON tier4_anesth_101_airway_assessment;
CREATE POLICY tier4_anesth_101_airway_assessment_t ON tier4_anesth_101_airway_assessment
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_anesth_101_airway_aspir (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  fasting_duration_h NUMERIC NOT NULL,
  prev_gi_surgery BOOLEAN,
  dm BOOLEAN,
  obesity BOOLEAN,
  emergency BOOLEAN,
  pregnancy BOOLEAN,
  risk TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_anesth_101_airway_aspir ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_anesth_101_airway_aspir FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_anesth_101_airway_aspir_t ON tier4_anesth_101_airway_aspir;
CREATE POLICY tier4_anesth_101_airway_aspir_t ON tier4_anesth_101_airway_aspir
  USING (tenant_id = current_setting('app.tenant_id', true));