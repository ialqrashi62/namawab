-- e378 TIER4_NEPH-102 Hemodialysis
CREATE TABLE IF NOT EXISTS tier4_neph_102_hd_adequacy (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  sp_kt_v NUMERIC NOT NULL,
  urr_pct NUMERIC NOT NULL,
  sessions_per_week INT NOT NULL,
  adequate TEXT,
  plan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_102_hd_adequacy ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_102_hd_adequacy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_102_hd_adequacy_t ON tier4_neph_102_hd_adequacy;
CREATE POLICY tier4_neph_102_hd_adequacy_t ON tier4_neph_102_hd_adequacy
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_neph_102_hd_access (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  access_type TEXT,
  qa_ml_min NUMERIC,
  recirculation_pct NUMERIC,
  complications TEXT,
  plan TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_102_hd_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_102_hd_access FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_102_hd_access_t ON tier4_neph_102_hd_access;
CREATE POLICY tier4_neph_102_hd_access_t ON tier4_neph_102_hd_access
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_neph_102_hd_idh (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  sbp_pre NUMERIC,
  sbp_nadir NUMERIC,
  drop_mmhg NUMERIC,
  episode_type TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_102_hd_idh ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_102_hd_idh FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_102_hd_idh_t ON tier4_neph_102_hd_idh;
CREATE POLICY tier4_neph_102_hd_idh_t ON tier4_neph_102_hd_idh
  USING (tenant_id = current_setting('app.tenant_id', true));