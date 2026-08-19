-- filepath: migrations/e999-g137_operations_ext.sql
CREATE TABLE IF NOT EXISTS tier117_workflow_615 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  handoff_id TEXT, protocol_id TEXT, order_set_id TEXT, rounding_id TEXT, checklist_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier117_workflow_615 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier117_workflow_615 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t117_workflow_615_isolation ON tier117_workflow_615;
CREATE POLICY t117_workflow_615_isolation ON tier117_workflow_615 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier117_clinical_decision_617 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  alert_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier117_clinical_decision_617 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier117_clinical_decision_617 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t117_cds_617_isolation ON tier117_clinical_decision_617;
CREATE POLICY t117_cds_617_isolation ON tier117_clinical_decision_617 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier117_quality_metrics_618 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  measure_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier117_quality_metrics_618 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier117_quality_metrics_618 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t117_quality_618_isolation ON tier117_quality_metrics_618;
CREATE POLICY t117_quality_618_isolation ON tier117_quality_metrics_618 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier117_credentialing_619 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  privilege_id TEXT, renewal_id TEXT, review_id TEXT, verification_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier117_credentialing_619 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier117_credentialing_619 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t117_cred_619_isolation ON tier117_credentialing_619;
CREATE POLICY t117_cred_619_isolation ON tier117_credentialing_619 USING (tenant_id = current_setting('app.tenant_id', true));