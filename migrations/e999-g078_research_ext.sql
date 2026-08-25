-- filepath: migrations/e999-g078_research_ext.sql
-- TIER58 Research Extended (5 tables)
CREATE TABLE IF NOT EXISTS res_trial (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  trial_id TEXT,
  phase TEXT,
  arm TEXT,
  enrollment_date TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE res_trial ENABLE ROW LEVEL SECURITY;
ALTER TABLE res_trial FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON res_trial;
CREATE POLICY p1 ON res_trial USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS res_pub (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  manuscript_id TEXT,
  journal TEXT,
  cohort_size NUMERIC,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE res_pub ENABLE ROW LEVEL SECURITY;
ALTER TABLE res_pub FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON res_pub;
CREATE POLICY p1 ON res_pub USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS res_grant (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  grant_id TEXT,
  funding_agency TEXT,
  amount_requested NUMERIC,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE res_grant ENABLE ROW LEVEL SECURITY;
ALTER TABLE res_grant FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON res_grant;
CREATE POLICY p1 ON res_grant USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS res_data (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  study TEXT,
  lock_type TEXT,
  database_clean_status TEXT,
  completion_pct NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE res_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE res_data FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON res_data;
CREATE POLICY p1 ON res_data USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS res_ethics (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  irb_number TEXT,
  risk_level TEXT,
  approval_status TEXT,
  subject_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE res_ethics ENABLE ROW LEVEL SECURITY;
ALTER TABLE res_ethics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON res_ethics;
CREATE POLICY p1 ON res_ethics USING (tenant_id = current_setting('app.tenant_id', true));