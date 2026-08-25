CREATE TABLE IF NOT EXISTS wh_preventive (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  well JSONB, breast JSONB, cervical JSONB, bone JSONB, cv JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE wh_preventive ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_preventive FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS wh_preventive_tenant_isolation ON wh_preventive;
CREATE POLICY wh_preventive_tenant_isolation ON wh_preventive USING (tenant_id = current_setting('app.tenant_id', true));
