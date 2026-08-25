-- e256 TIER3_ICU-101 Mechanical Ventilation UP
CREATE TABLE IF NOT EXISTS icu_vent_settings (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  setting_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  encounter_id INTEGER,
  mode VARCHAR(40),
  tidal_volume_ml_per_kg NUMERIC(4,2),
  peep_cm_h2o NUMERIC(4,1),
  fio2 NUMERIC(4,2),
  plateau_pressure NUMERIC(4,1),
  driving_pressure NUMERIC(4,1),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  recorded_by INTEGER
);
ALTER TABLE icu_vent_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_vent_settings FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS icu_v_tenant_isolation ON icu_vent_settings;
CREATE POLICY icu_v_tenant_isolation ON icu_vent_settings
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS icu_wean_protocols (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  protocol_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  sbt_eligible VARCHAR(5),
  rsbi NUMERIC(6,2),
  outcome VARCHAR(30),
  extubation_status VARCHAR(30),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE icu_wean_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_wean_protocols FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS icu_w_tenant_isolation ON icu_wean_protocols;
CREATE POLICY icu_w_tenant_isolation ON icu_wean_protocols
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));