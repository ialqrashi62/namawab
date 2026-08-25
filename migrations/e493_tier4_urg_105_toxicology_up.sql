-- e493 TIER4_URG-105 Toxicology
CREATE TABLE IF NOT EXISTS tier4_urg_105_tox_acet (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  serum_level_ug_ml NUMERIC NOT NULL,
  hours_post_ingestion NUMERIC NOT NULL,
  on_rumack_line NUMERIC NOT NULL,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urg_105_tox_acet ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urg_105_tox_acet FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urg_105_tox_acet_t ON tier4_urg_105_tox_acet;
CREATE POLICY tier4_urg_105_tox_acet_t ON tier4_urg_105_tox_acet
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_urg_105_tox_opioid (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  respiratory_rate NUMERIC NOT NULL,
  pupil_size TEXT NOT NULL,
  gcs NUMERIC NOT NULL,
  suspected BOOLEAN,
  intervention TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urg_105_tox_opioid ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urg_105_tox_opioid FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urg_105_tox_opioid_t ON tier4_urg_105_tox_opioid;
CREATE POLICY tier4_urg_105_tox_opioid_t ON tier4_urg_105_tox_opioid
  USING (tenant_id = current_setting('app.tenant_id', true));