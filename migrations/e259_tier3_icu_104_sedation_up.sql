-- e259 TIER3_ICU-104 ICU Sedation / Delirium UP
CREATE TABLE IF NOT EXISTS icu_sedation_logs (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  log_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  rass_score INTEGER,
  pain_score_nrs INTEGER,
  sedation_agent VARCHAR(40),
  dose NUMERIC(8,2),
  daily_sedation_interruption VARCHAR(5),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE icu_sedation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_sedation_logs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS icu_sed_tenant_isolation ON icu_sedation_logs;
CREATE POLICY icu_sed_tenant_isolation ON icu_sedation_logs
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS icu_delirium_screenings (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  screening_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  cam_icu_positive VARCHAR(5),
  subtype VARCHAR(20),
  prevention_bundle_compliant VARCHAR(5),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE icu_delirium_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_delirium_screenings FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS icu_del_tenant_isolation ON icu_delirium_screenings;
CREATE POLICY icu_del_tenant_isolation ON icu_delirium_screenings
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));