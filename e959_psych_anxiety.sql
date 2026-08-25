CREATE TABLE IF NOT EXISTS psych_anxiety (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  gad JSONB, panic JSONB, ocd JSONB, ptsd JSONB, social JSONB, fu JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE psych_anxiety ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_anxiety FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psych_anxiety_tenant_isolation ON psych_anxiety;
CREATE POLICY psych_anxiety_tenant_isolation ON psych_anxiety USING (tenant_id = current_setting('app.tenant_id', true));
