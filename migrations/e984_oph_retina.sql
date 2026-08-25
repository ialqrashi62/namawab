CREATE TABLE IF NOT EXISTS oph_retina (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  screen JSONB, amd JSONB, antivegf JSONB, rd JSONB, laser JSONB, fu JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE oph_retina ENABLE ROW LEVEL SECURITY;
ALTER TABLE oph_retina FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS oph_retina_tenant_isolation ON oph_retina;
CREATE POLICY oph_retina_tenant_isolation ON oph_retina USING (tenant_id = current_setting('app.tenant_id', true));
