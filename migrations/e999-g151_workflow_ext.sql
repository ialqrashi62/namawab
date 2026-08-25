-- filepath: migrations/e999-g151_workflow_ext.sql
CREATE TABLE IF NOT EXISTS tier131_workflow_advanced_672 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  path_id TEXT, task_id TEXT, esc_id TEXT, handoff_id TEXT, ds_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier131_workflow_advanced_672 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier131_workflow_advanced_672 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t131_wf_672_isolation ON tier131_workflow_advanced_672;
CREATE POLICY t131_wf_672_isolation ON tier131_workflow_advanced_672 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier131_quality_advanced_673 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  inc_id TEXT, cmp_id TEXT, sv_id TEXT, qi_id TEXT, pr_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier131_quality_advanced_673 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier131_quality_advanced_673 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t131_qa_673_isolation ON tier131_quality_advanced_673;
CREATE POLICY t131_qa_673_isolation ON tier131_quality_advanced_673 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier131_compliance_audit_674 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  reg_id TEXT, af_id TEXT, ca_id TEXT, ra_id TEXT, at_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier131_compliance_audit_674 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier131_compliance_audit_674 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t131_co_674_isolation ON tier131_compliance_audit_674;
CREATE POLICY t131_co_674_isolation ON tier131_compliance_audit_674 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier131_decision_support_675 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  alert_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier131_decision_support_675 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier131_decision_support_675 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t131_ds_675_isolation ON tier131_decision_support_675;
CREATE POLICY t131_ds_675_isolation ON tier131_decision_support_675 USING (tenant_id = current_setting('app.tenant_id', true));