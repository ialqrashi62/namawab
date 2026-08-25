-- e486 TIER4_ANESTH-104 Pain
CREATE TABLE IF NOT EXISTS tier4_anesth_104_pain_postop (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pain_nrs NUMERIC NOT NULL,
  surgery_type TEXT NOT NULL,
  opioid_naive BOOLEAN,
  renal_failure BOOLEAN,
  recommendation TEXT,
  opioid_choice TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_anesth_104_pain_postop ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_anesth_104_pain_postop FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_anesth_104_pain_postop_t ON tier4_anesth_104_pain_postop;
CREATE POLICY tier4_anesth_104_pain_postop_t ON tier4_anesth_104_pain_postop
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_anesth_104_pain_chronic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  daily_mme NUMERIC NOT NULL,
  benzos_concurrent BOOLEAN,
  naloxone_prescribed BOOLEAN,
  pdmp_checked BOOLEAN,
  plan TEXT,
  risk_score NUMERIC,
  risk TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_anesth_104_pain_chronic ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_anesth_104_pain_chronic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_anesth_104_pain_chronic_t ON tier4_anesth_104_pain_chronic;
CREATE POLICY tier4_anesth_104_pain_chronic_t ON tier4_anesth_104_pain_chronic
  USING (tenant_id = current_setting('app.tenant_id', true));