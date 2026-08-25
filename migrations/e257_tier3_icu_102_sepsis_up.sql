-- e257 TIER3_ICU-102 Sepsis Resuscitation UP
CREATE TABLE IF NOT EXISTS icu_sepsis_bundles (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  bundle_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  lactate_initial NUMERIC(5,2),
  lactate_6h NUMERIC(5,2),
  cultures_drawn VARCHAR(5),
  antibiotic_within_1h VARCHAR(5),
  fluid_30ml_per_kg VARCHAR(5),
  vasopressor_started VARCHAR(5),
  bundle_complete VARCHAR(5),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE icu_sepsis_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_sepsis_bundles FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS icu_s_tenant_isolation ON icu_sepsis_bundles;
CREATE POLICY icu_s_tenant_isolation ON icu_sepsis_bundles
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS icu_vasopressor_logs (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  log_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  agent VARCHAR(40),
  dose_mcg_per_kg_per_min NUMERIC(6,2),
  map_target_greater_than_65 VARCHAR(5),
  lactate_trend VARCHAR(20),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE icu_vasopressor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_vasopressor_logs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS icu_vaso_tenant_isolation ON icu_vasopressor_logs;
CREATE POLICY icu_vaso_tenant_isolation ON icu_vasopressor_logs
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));