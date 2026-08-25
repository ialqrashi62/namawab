CREATE TABLE IF NOT EXISTS psych_substance (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  screen JSONB, detox JSONB, relapse_prev JSONB, mat JSONB, overdose_prev JSONB, fu JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE psych_substance ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_substance FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psych_substance_tenant_isolation ON psych_substance;
CREATE POLICY psych_substance_tenant_isolation ON psych_substance USING (tenant_id = current_setting('app.tenant_id', true));
