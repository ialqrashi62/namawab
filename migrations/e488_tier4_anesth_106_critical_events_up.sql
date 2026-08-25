-- e488 TIER4_ANESTH-106 Critical Events
CREATE TABLE IF NOT EXISTS tier4_anesth_106_critical_mh (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  etco2_rising BOOLEAN,
  muscle_rigidity BOOLEAN,
  temp_rising_rate_per_hr NUMERIC NOT NULL,
  tachycardia BOOLEAN,
  family_history_mh BOOLEAN,
  score NUMERIC,
  diagnosis TEXT,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_anesth_106_critical_mh ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_anesth_106_critical_mh FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_anesth_106_critical_mh_t ON tier4_anesth_106_critical_mh;
CREATE POLICY tier4_anesth_106_critical_mh_t ON tier4_anesth_106_critical_mh
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_anesth_106_critical_hypotension (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  map NUMERIC NOT NULL,
  hr NUMERIC NOT NULL,
  blood_loss_ml NUMERIC NOT NULL,
  spinal BOOLEAN,
  cause TEXT NOT NULL,
  intervention TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_anesth_106_critical_hypotension ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_anesth_106_critical_hypotension FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_anesth_106_critical_hypotension_t ON tier4_anesth_106_critical_hypotension;
CREATE POLICY tier4_anesth_106_critical_hypotension_t ON tier4_anesth_106_critical_hypotension
  USING (tenant_id = current_setting('app.tenant_id', true));