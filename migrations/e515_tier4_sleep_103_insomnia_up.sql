-- e515 TIER4_SLEEP-103 Insomnia
CREATE TABLE IF NOT EXISTS tier4_sleep_103_insomnia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  sleep_onset_insomnia BOOLEAN,
  sleep_maintenance_insomnia BOOLEAN,
  early_awakening BOOLEAN,
  duration_months NUMERIC NOT NULL,
  daytime_impairment BOOLEAN,
  chronic BOOLEAN,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_sleep_103_insomnia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_sleep_103_insomnia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_sleep_103_insomnia_t ON tier4_sleep_103_insomnia;
CREATE POLICY tier4_sleep_103_insomnia_t ON tier4_sleep_103_insomnia
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_sleep_103_hygiene (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  consistent_bedtime BOOLEAN,
  no_caffeine_pm BOOLEAN,
  no_alcohol_pm BOOLEAN,
  exercise_regularly BOOLEAN,
  no_screens_bed BOOLEAN,
  dark_quiet_room BOOLEAN,
  total NUMERIC,
  quality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_sleep_103_hygiene ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_sleep_103_hygiene FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_sleep_103_hygiene_t ON tier4_sleep_103_hygiene;
CREATE POLICY tier4_sleep_103_hygiene_t ON tier4_sleep_103_hygiene
  USING (tenant_id = current_setting('app.tenant_id', true));