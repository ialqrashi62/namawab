CREATE TABLE IF NOT EXISTS psych_mood (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  depression JSONB, bipolar JSONB, med JSONB, lithium JSONB, si JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE psych_mood ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_mood FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psych_mood_tenant_isolation ON psych_mood;
CREATE POLICY psych_mood_tenant_isolation ON psych_mood USING (tenant_id = current_setting('app.tenant_id', true));
