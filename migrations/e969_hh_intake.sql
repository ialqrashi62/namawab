CREATE TABLE IF NOT EXISTS hh_intake (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  elig JSONB, oasis JSONB, soc JSONB, o30 JSONB, verify JSONB, dplan JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE hh_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE hh_intake FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hh_intake_tenant_isolation ON hh_intake;
CREATE POLICY hh_intake_tenant_isolation ON hh_intake USING (tenant_id = current_setting('app.tenant_id', true));
