-- e517 TIER4_SLEEP-105 Circadian
CREATE TABLE IF NOT EXISTS tier4_sleep_105_chrono (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  wake_time_hr NUMERIC NOT NULL,
  peak_alertness_hr NUMERIC NOT NULL,
  sleep_time_hr NUMERIC NOT NULL,
  chronotype TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_sleep_105_chrono ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_sleep_105_chrono FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_sleep_105_chrono_t ON tier4_sleep_105_chrono;
CREATE POLICY tier4_sleep_105_chrono_t ON tier4_sleep_105_chrono
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_sleep_105_shift (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  shift_type TEXT NOT NULL,
  sleep_duration NUMERIC NOT NULL,
  caffeine_use NUMERIC NOT NULL,
  schedule TEXT,
  fatigue_risk TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_sleep_105_shift ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_sleep_105_shift FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_sleep_105_shift_t ON tier4_sleep_105_shift;
CREATE POLICY tier4_sleep_105_shift_t ON tier4_sleep_105_shift
  USING (tenant_id = current_setting('app.tenant_id', true));