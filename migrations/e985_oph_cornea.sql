CREATE TABLE IF NOT EXISTS oph_cornea (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  workup JSONB, dry JSONB, infect JSONB, kc JSONB, tx JSONB, fu JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE oph_cornea ENABLE ROW LEVEL SECURITY;
ALTER TABLE oph_cornea FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS oph_cornea_tenant_isolation ON oph_cornea;
CREATE POLICY oph_cornea_tenant_isolation ON oph_cornea USING (tenant_id = current_setting('app.tenant_id', true));
