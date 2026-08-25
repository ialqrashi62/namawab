CREATE TABLE IF NOT EXISTS psych_psychotic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  first_episode JSONB, init JSONB, metabolic JSONB, clozapine JSONB, adherence JSONB, recovery JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE psych_psychotic ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_psychotic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psych_psychotic_tenant_isolation ON psych_psychotic;
CREATE POLICY psych_psychotic_tenant_isolation ON psych_psychotic USING (tenant_id = current_setting('app.tenant_id', true));
