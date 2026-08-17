-- filepath: migrations/e999-g031_rheumatology_ext.sql
-- TIER35 Rheumatology Extended (5 tables)
CREATE TABLE IF NOT EXISTS rheum_ra (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  duration_weeks NUMERIC,
  das28 NUMERIC,
  mtx_dose NUMERIC,
  biologic TEXT,
  hand_ot_referred BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rheum_ra ENABLE ROW LEVEL SECURITY;
ALTER TABLE rheum_ra FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rheum_ra;
CREATE POLICY p1 ON rheum_ra USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rheum_lupus (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  ana_positive BOOLEAN,
  anti_dsdna NUMERIC,
  sledai NUMERIC,
  biopsy_class TEXT,
  induction TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rheum_lupus ENABLE ROW LEVEL SECURITY;
ALTER TABLE rheum_lupus FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rheum_lupus;
CREATE POLICY p1 ON rheum_lupus USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rheum_vasculitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  anca_type TEXT,
  creatinine NUMERIC,
  bv_score NUMERIC,
  age NUMERIC,
  esr NUMERIC,
  oral_ulcers BOOLEAN,
  uveitis BOOLEAN,
  renal_involvement BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rheum_vasculitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE rheum_vasculitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rheum_vasculitis;
CREATE POLICY p1 ON rheum_vasculitis USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rheum_myo (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  heliotrope_rash BOOLEAN,
  gottron_papules BOOLEAN,
  ck NUMERIC,
  ild_present BOOLEAN,
  pattern TEXT,
  fvc_pct NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rheum_myo ENABLE ROW LEVEL SECURITY;
ALTER TABLE rheum_myo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rheum_myo;
CREATE POLICY p1 ON rheum_myo USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rheum_spine (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  age NUMERIC,
  sacroiliac_inflammation BOOLEAN,
  hla_b27 TEXT,
  basdai NUMERIC,
  psoriasis_severity TEXT,
  ibd_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rheum_spine ENABLE ROW LEVEL SECURITY;
ALTER TABLE rheum_spine FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rheum_spine;
CREATE POLICY p1 ON rheum_spine USING (tenant_id = current_setting('app.tenant_id', true));