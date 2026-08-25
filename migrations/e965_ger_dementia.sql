CREATE TABLE IF NOT EXISTS ger_dementia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  workup JSONB, stage JSONB, medication JSONB, safety JSONB, bpsd JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ger_dementia ENABLE ROW LEVEL SECURITY;
ALTER TABLE ger_dementia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ger_dementia_tenant_isolation ON ger_dementia;
CREATE POLICY ger_dementia_tenant_isolation ON ger_dementia USING (tenant_id = current_setting('app.tenant_id', true));
