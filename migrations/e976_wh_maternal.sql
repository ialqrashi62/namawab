CREATE TABLE IF NOT EXISTS wh_maternal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  intake JSONB, preeclampsia JSONB, gdm JSONB, iugr JSONB, multifetal JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE wh_maternal ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_maternal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS wh_maternal_tenant_isolation ON wh_maternal;
CREATE POLICY wh_maternal_tenant_isolation ON wh_maternal USING (tenant_id = current_setting('app.tenant_id', true));
