-- e509 TIER4_CHRONIC-103 Transitions
CREATE TABLE IF NOT EXISTS tier4_chronic_103_trans_dcc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  chronic_conditions TEXT,
  new_medications NUMERIC NOT NULL,
  education_completed BOOLEAN,
  caregiver_present BOOLEAN,
  follow_up_scheduled BOOLEAN,
  home_services BOOLEAN,
  score NUMERIC,
  readiness TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_chronic_103_trans_dcc ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_chronic_103_trans_dcc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_chronic_103_trans_dcc_t ON tier4_chronic_103_trans_dcc;
CREATE POLICY tier4_chronic_103_trans_dcc_t ON tier4_chronic_103_trans_dcc
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_chronic_103_trans_readmit (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  chronic_conditions TEXT,
  previous_admissions_6mo NUMERIC NOT NULL,
  polypharmacy BOOLEAN,
  lack_social_support BOOLEAN,
  low_health_literacy BOOLEAN,
  dnr BOOLEAN,
  risk NUMERIC,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_chronic_103_trans_readmit ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_chronic_103_trans_readmit FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_chronic_103_trans_readmit_t ON tier4_chronic_103_trans_readmit;
CREATE POLICY tier4_chronic_103_trans_readmit_t ON tier4_chronic_103_trans_readmit
  USING (tenant_id = current_setting('app.tenant_id', true));