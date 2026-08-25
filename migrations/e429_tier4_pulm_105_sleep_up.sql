-- e429 TIER4_PULM-105 Sleep
CREATE TABLE IF NOT EXISTS tier4_pulm_105_sleep_osa (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ahi_events_per_hour NUMERIC NOT NULL,
  severity TEXT,
  excessive_daytime_sleepiness BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_105_sleep_osa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_105_sleep_osa FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_105_sleep_osa_t ON tier4_pulm_105_sleep_osa;
CREATE POLICY tier4_pulm_105_sleep_osa_t ON tier4_pulm_105_sleep_osa
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_pulm_105_sleep_insomnia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  isi_score INT NOT NULL,
  severity TEXT,
  chronicity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_105_sleep_insomnia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_105_sleep_insomnia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_105_sleep_insomnia_t ON tier4_pulm_105_sleep_insomnia;
CREATE POLICY tier4_pulm_105_sleep_insomnia_t ON tier4_pulm_105_sleep_insomnia
  USING (tenant_id = current_setting('app.tenant_id', true));