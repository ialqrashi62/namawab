CREATE TABLE IF NOT EXISTS wh_gynonco (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  stage JSONB, surgery JSONB, chemo JSONB, radiation JSONB, survivorship JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE wh_gynonco ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_gynonco FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS wh_gynonco_tenant_isolation ON wh_gynonco;
CREATE POLICY wh_gynonco_tenant_isolation ON wh_gynonco USING (tenant_id = current_setting('app.tenant_id', true));
