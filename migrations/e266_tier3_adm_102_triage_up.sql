-- e266 TIER3_ADM-102 Triage / ESI UP
CREATE TABLE IF NOT EXISTS adm_triage_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  triage_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  esi_level INTEGER,
  triage_color VARCHAR(20),
  arrival_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  triage_time TIMESTAMPTZ,
  nurse_id INTEGER
);
ALTER TABLE adm_triage_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_triage_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_t_tenant_isolation ON adm_triage_assessments;
CREATE POLICY adm_t_tenant_isolation ON adm_triage_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS adm_diversion_log (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  diversion_id VARCHAR(50) UNIQUE NOT NULL,
  diversion_start TIMESTAMPTZ NOT NULL,
  diversion_end TIMESTAMPTZ,
  reason TEXT,
  categories_accepted VARCHAR(200),
  approved_by INTEGER
);
ALTER TABLE adm_diversion_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_diversion_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_d_tenant_isolation ON adm_diversion_log;
CREATE POLICY adm_d_tenant_isolation ON adm_diversion_log
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));