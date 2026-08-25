CREATE TABLE IF NOT EXISTS oph_glaucoma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  screen JSONB, diag JSONB, med JSONB, laser JSONB, surgery JSONB, fu JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE oph_glaucoma ENABLE ROW LEVEL SECURITY;
ALTER TABLE oph_glaucoma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS oph_glaucoma_tenant_isolation ON oph_glaucoma;
CREATE POLICY oph_glaucoma_tenant_isolation ON oph_glaucoma USING (tenant_id = current_setting('app.tenant_id', true));
