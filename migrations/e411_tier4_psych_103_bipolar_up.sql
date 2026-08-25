-- e411 TIER4_PSYCH-103 Bipolar
CREATE TABLE IF NOT EXISTS tier4_psych_103_bipolar_mania (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ygmrs_score INT,
  severity TEXT,
  psychotic_features BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_103_bipolar_mania ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_103_bipolar_mania FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_103_bipolar_mania_t ON tier4_psych_103_bipolar_mania;
CREATE POLICY tier4_psych_103_bipolar_mania_t ON tier4_psych_103_bipolar_mania
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_psych_103_bipolar_maintenance (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  episodes_last_2yr INT,
  current_phase TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_103_bipolar_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_103_bipolar_maintenance FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_103_bipolar_maintenance_t ON tier4_psych_103_bipolar_maintenance;
CREATE POLICY tier4_psych_103_bipolar_maintenance_t ON tier4_psych_103_bipolar_maintenance
  USING (tenant_id = current_setting('app.tenant_id', true));