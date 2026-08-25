-- e271 TIER3_ADM-107 Pre-Operative Assessment UP
CREATE TABLE IF NOT EXISTS adm_preop_assessments (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  preop_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  planned_procedure TEXT,
  asa_class VARCHAR(5),
  surgical_risk_category VARCHAR(30),
  anesthesia_clearance VARCHAR(5),
  npo_confirmed VARCHAR(5),
  consent_signed VARCHAR(5),
  site_marked VARCHAR(5),
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assessed_by INTEGER
);
ALTER TABLE adm_preop_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_preop_assessments FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_po_tenant_isolation ON adm_preop_assessments;
CREATE POLICY adm_po_tenant_isolation ON adm_preop_assessments
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS adm_who_checklist (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  checklist_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  procedure_id INTEGER,
  sign_in_done VARCHAR(5),
  time_out_done VARCHAR(5),
  sign_out_done VARCHAR(5),
  checklist_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE adm_who_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_who_checklist FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_wc_tenant_isolation ON adm_who_checklist;
CREATE POLICY adm_wc_tenant_isolation ON adm_who_checklist
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));