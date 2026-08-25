CREATE TABLE IF NOT EXISTS oph_refractive (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  screen JSONB, lasik JSONB, prk JSONB, icl JSONB, smile JSONB, fu JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE oph_refractive ENABLE ROW LEVEL SECURITY;
ALTER TABLE oph_refractive FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS oph_refractive_tenant_isolation ON oph_refractive;
CREATE POLICY oph_refractive_tenant_isolation ON oph_refractive USING (tenant_id = current_setting('app.tenant_id', true));
