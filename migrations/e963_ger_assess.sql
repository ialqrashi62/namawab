CREATE TABLE IF NOT EXISTS ger_assess (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  intake JSONB, adl JSONB, cognitive JSONB, mobility JSONB, nutrition JSONB, cga_sum JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ger_assess ENABLE ROW LEVEL SECURITY;
ALTER TABLE ger_assess FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ger_assess_tenant_isolation ON ger_assess;
CREATE POLICY ger_assess_tenant_isolation ON ger_assess USING (tenant_id = current_setting('app.tenant_id', true));
