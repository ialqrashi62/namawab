-- e468 TIER4_UROL-104 Uro-Oncology
CREATE TABLE IF NOT EXISTS tier4_urol_104_onco_prostate (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  psa NUMERIC NOT NULL,
  gleason_primary NUMERIC NOT NULL,
  gleason_secondary NUMERIC NOT NULL,
  isup NUMERIC,
  stage TEXT NOT NULL,
  risk TEXT,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urol_104_onco_prostate ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urol_104_onco_prostate FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urol_104_onco_prostate_t ON tier4_urol_104_onco_prostate;
CREATE POLICY tier4_urol_104_onco_prostate_t ON tier4_urol_104_onco_prostate
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_urol_104_onco_bladder (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  tumor_count NUMERIC NOT NULL,
  size_cm NUMERIC NOT NULL,
  cis BOOLEAN,
  grade TEXT NOT NULL,
  muscle_invasion BOOLEAN,
  stage TEXT,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urol_104_onco_bladder ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urol_104_onco_bladder FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urol_104_onco_bladder_t ON tier4_urol_104_onco_bladder;
CREATE POLICY tier4_urol_104_onco_bladder_t ON tier4_urol_104_onco_bladder
  USING (tenant_id = current_setting('app.tenant_id', true));