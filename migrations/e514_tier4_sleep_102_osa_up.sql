-- e514 TIER4_SLEEP-102 OSA
CREATE TABLE IF NOT EXISTS tier4_sleep_102_stopbang (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  snoring BOOLEAN,
  tired BOOLEAN,
  observed_apnea BOOLEAN,
  high_blood_pressure BOOLEAN,
  bmi NUMERIC NOT NULL,
  age NUMERIC NOT NULL,
  neck_cm NUMERIC NOT NULL,
  male BOOLEAN,
  score NUMERIC,
  risk TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_sleep_102_stopbang ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_sleep_102_stopbang FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_sleep_102_stopbang_t ON tier4_sleep_102_stopbang;
CREATE POLICY tier4_sleep_102_stopbang_t ON tier4_sleep_102_stopbang
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_sleep_102_ahi (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ahi NUMERIC NOT NULL,
  severity TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_sleep_102_ahi ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_sleep_102_ahi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_sleep_102_ahi_t ON tier4_sleep_102_ahi;
CREATE POLICY tier4_sleep_102_ahi_t ON tier4_sleep_102_ahi
  USING (tenant_id = current_setting('app.tenant_id', true));