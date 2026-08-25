CREATE TABLE IF NOT EXISTS wh_fetal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  first_tri JSONB, anatomy JSONB, invasive JSONB, counsel JSONB, anomalies JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE wh_fetal ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_fetal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS wh_fetal_tenant_isolation ON wh_fetal;
CREATE POLICY wh_fetal_tenant_isolation ON wh_fetal USING (tenant_id = current_setting('app.tenant_id', true));
