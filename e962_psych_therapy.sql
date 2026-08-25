CREATE TABLE IF NOT EXISTS psych_therapy (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  cbt JSONB, emdr JSONB, dbt JSONB, mi JSONB, family JSONB, group JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE psych_therapy ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_therapy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psych_therapy_tenant_isolation ON psych_therapy;
CREATE POLICY psych_therapy_tenant_isolation ON psych_therapy USING (tenant_id = current_setting('app.tenant_id', true));
