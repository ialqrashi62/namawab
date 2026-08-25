-- e489 TIER4_URG-101 Triage
CREATE TABLE IF NOT EXISTS tier4_urg_101_triage_esi (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  life_threatening BOOLEAN,
  severe_pain BOOLEAN,
  resources NUMERIC NOT NULL,
  vitals_abnormal BOOLEAN,
  level TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urg_101_triage_esi ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urg_101_triage_esi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urg_101_triage_esi_t ON tier4_urg_101_triage_esi;
CREATE POLICY tier4_urg_101_triage_esi_t ON tier4_urg_101_triage_esi
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_urg_101_triage_cc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  complaint TEXT NOT NULL,
  onset_hours NUMERIC NOT NULL,
  severity NUMERIC NOT NULL,
  priority TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urg_101_triage_cc ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urg_101_triage_cc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urg_101_triage_cc_t ON tier4_urg_101_triage_cc;
CREATE POLICY tier4_urg_101_triage_cc_t ON tier4_urg_101_triage_cc
  USING (tenant_id = current_setting('app.tenant_id', true));