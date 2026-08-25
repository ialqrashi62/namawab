-- e427 TIER4_PULM-103 ILD
CREATE TABLE IF NOT EXISTS tier4_pulm_103_ild_ipf (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  fvc_pct NUMERIC NOT NULL,
  dlco_pct NUMERIC,
  honeycombing BOOLEAN,
  hrct_pattern TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_103_ild_ipf ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_103_ild_ipf FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_103_ild_ipf_t ON tier4_pulm_103_ild_ipf;
CREATE POLICY tier4_pulm_103_ild_ipf_t ON tier4_pulm_103_ild_ipf
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_pulm_103_ild_workup (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ct_pattern TEXT,
  autoimmune TEXT,
  hypersens TEXT,
  etiology TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_103_ild_workup ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_103_ild_workup FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_103_ild_workup_t ON tier4_pulm_103_ild_workup;
CREATE POLICY tier4_pulm_103_ild_workup_t ON tier4_pulm_103_ild_workup
  USING (tenant_id = current_setting('app.tenant_id', true));