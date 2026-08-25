CREATE TABLE IF NOT EXISTS oph_pedi (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  redeye JSONB, strab JSONB, amb JSONB, rop JSONB, ae JSONB, fu JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE oph_pedi ENABLE ROW LEVEL SECURITY;
ALTER TABLE oph_pedi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS oph_pedi_tenant_isolation ON oph_pedi;
CREATE POLICY oph_pedi_tenant_isolation ON oph_pedi USING (tenant_id = current_setting('app.tenant_id', true));
