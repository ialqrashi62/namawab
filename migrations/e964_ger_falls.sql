CREATE TABLE IF NOT EXISTS ger_falls (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  screen JSONB, circ JSONB, home JSONB, exercise JSONB, post JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ger_falls ENABLE ROW LEVEL SECURITY;
ALTER TABLE ger_falls FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ger_falls_tenant_isolation ON ger_falls;
CREATE POLICY ger_falls_tenant_isolation ON ger_falls USING (tenant_id = current_setting('app.tenant_id', true));
