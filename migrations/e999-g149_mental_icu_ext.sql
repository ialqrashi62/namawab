-- filepath: migrations/e999-g149_mental_icu_ext.sql
CREATE TABLE IF NOT EXISTS tier129_mental_664 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  phq_id TEXT, gad_id TEXT, pcl_id TEXT, crisis_id TEXT, pt_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier129_mental_664 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier129_mental_664 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t129_mh_664_isolation ON tier129_mental_664;
CREATE POLICY t129_mh_664_isolation ON tier129_mental_664 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier129_substance_665 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  audit_id TEXT, dast_id TEXT, detox_id TEXT, nal_id TEXT, re_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier129_substance_665 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier129_substance_665 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t129_sa_665_isolation ON tier129_substance_665;
CREATE POLICY t129_sa_665_isolation ON tier129_substance_665 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier129_icu_666 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  vent_id TEXT, sed_id TEXT, vp_id TEXT, fb_id TEXT, consult_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier129_icu_666 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier129_icu_666 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t129_ic_666_isolation ON tier129_icu_666;
CREATE POLICY t129_ic_666_isolation ON tier129_icu_666 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier129_ed_extended_667 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  triage_id TEXT, t_id TEXT, sb_id TEXT, sp_id TEXT, ami_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier129_ed_extended_667 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier129_ed_extended_667 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t129_ed_667_isolation ON tier129_ed_extended_667;
CREATE POLICY t129_ed_667_isolation ON tier129_ed_extended_667 USING (tenant_id = current_setting('app.tenant_id', true));