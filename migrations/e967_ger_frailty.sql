CREATE TABLE IF NOT EXISTS ger_frailty (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  index JSONB, sarc JSONB, prehab JSONB, medication JSONB, discharge JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ger_frailty ENABLE ROW LEVEL SECURITY;
ALTER TABLE ger_frailty FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ger_frailty_tenant_isolation ON ger_frailty;
CREATE POLICY ger_frailty_tenant_isolation ON ger_frailty USING (tenant_id = current_setting('app.tenant_id', true));
