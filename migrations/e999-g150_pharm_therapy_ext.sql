-- filepath: migrations/e999-g150_pharm_therapy_ext.sql
CREATE TABLE IF NOT EXISTS tier130_pharm_admin_668 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  order_id TEXT, iv_id TEXT, pe_id TEXT, mr_id TEXT, inv_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier130_pharm_admin_668 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier130_pharm_admin_668 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t130_pa_668_isolation ON tier130_pharm_admin_668;
CREATE POLICY t130_pa_668_isolation ON tier130_pharm_admin_668 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier130_therapy_669 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pt_id TEXT, ot_id TEXT, st_id TEXT, rt_id TEXT, d_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier130_therapy_669 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier130_therapy_669 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t130_th_669_isolation ON tier130_therapy_669;
CREATE POLICY t130_th_669_isolation ON tier130_therapy_669 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier130_surg_sched_670 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  bt_id TEXT, pa_id TEXT, book_id TEXT, cancel_id TEXT, util_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier130_surg_sched_670 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier130_surg_sched_670 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t130_ss_670_isolation ON tier130_surg_sched_670;
CREATE POLICY t130_ss_670_isolation ON tier130_surg_sched_670 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier130_education_671 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  audit_id TEXT, edu_id TEXT, pol_id TEXT, tra_id TEXT, cme_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier130_education_671 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier130_education_671 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t130_ed_671_isolation ON tier130_education_671;
CREATE POLICY t130_ed_671_isolation ON tier130_education_671 USING (tenant_id = current_setting('app.tenant_id', true));