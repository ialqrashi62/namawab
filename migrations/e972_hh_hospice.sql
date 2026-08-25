CREATE TABLE IF NOT EXISTS hh_hospice (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  elig JSONB, ad JSONB, sym JSONB, visits JSONB, bereave JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE hh_hospice ENABLE ROW LEVEL SECURITY;
ALTER TABLE hh_hospice FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hh_hospice_tenant_isolation ON hh_hospice;
CREATE POLICY hh_hospice_tenant_isolation ON hh_hospice USING (tenant_id = current_setting('app.tenant_id', true));
