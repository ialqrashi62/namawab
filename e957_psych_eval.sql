CREATE TABLE IF NOT EXISTS psych_eval (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  intake JSONB, history JSONB, mse JSONB, risk JSONB, diagnosis JSONB, plan JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE psych_eval ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_eval FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psych_eval_tenant_isolation ON psych_eval;
CREATE POLICY psych_eval_tenant_isolation ON psych_eval USING (tenant_id = current_setting('app.tenant_id', true));
