-- filepath: migrations/e999-g152_specialty_clinical_ext.sql
CREATE TABLE IF NOT EXISTS tier132_gastro_676 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  scope_id TEXT, lb_id TEXT, us_id TEXT, md_id TEXT, ct_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier132_gastro_676 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier132_gastro_676 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t132_gi_676_isolation ON tier132_gastro_676;
CREATE POLICY t132_gi_676_isolation ON tier132_gastro_676 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier132_pulm_677 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pft_id TEXT, sleep_id TEXT, vent_id TEXT, tb_id TEXT, ox_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier132_pulm_677 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier132_pulm_677 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t132_pulm_677_isolation ON tier132_pulm_677;
CREATE POLICY t132_pulm_677_isolation ON tier132_pulm_677 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier132_endo_678 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  dm_id TEXT, thyroid_id TEXT, adr_id TEXT, repro_id TEXT, bone_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier132_endo_678 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier132_endo_678 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t132_endo_678_isolation ON tier132_endo_678;
CREATE POLICY t132_endo_678_isolation ON tier132_endo_678 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier132_rheum_679 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  arth_id TEXT, con_id TEXT, med_id TEXT, rehab_id TEXT, das_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier132_rheum_679 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier132_rheum_679 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t132_rh_679_isolation ON tier132_rheum_679;
CREATE POLICY t132_rh_679_isolation ON tier132_rheum_679 USING (tenant_id = current_setting('app.tenant_id', true));