-- e512 TIER4_CHRONIC-106 Palliative
CREATE TABLE IF NOT EXISTS tier4_chronic_106_pall_goals (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  prognosis TEXT NOT NULL,
  functional_status TEXT NOT NULL,
  patient_goals TEXT NOT NULL,
  plan TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_chronic_106_pall_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_chronic_106_pall_goals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_chronic_106_pall_goals_t ON tier4_chronic_106_pall_goals;
CREATE POLICY tier4_chronic_106_pall_goals_t ON tier4_chronic_106_pall_goals
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_chronic_106_pall_symptoms (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pain NUMERIC NOT NULL,
  dyspnea NUMERIC NOT NULL,
  nausea NUMERIC NOT NULL,
  fatigue NUMERIC NOT NULL,
  depression NUMERIC NOT NULL,
  anxiety NUMERIC NOT NULL,
  total NUMERIC,
  severity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_chronic_106_pall_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_chronic_106_pall_symptoms FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_chronic_106_pall_symptoms_t ON tier4_chronic_106_pall_symptoms;
CREATE POLICY tier4_chronic_106_pall_symptoms_t ON tier4_chronic_106_pall_symptoms
  USING (tenant_id = current_setting('app.tenant_id', true));