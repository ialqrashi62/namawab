CREATE TABLE IF NOT EXISTS ger_polypharm (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  brown_bag JSONB, beers JSONB, deprescribing JSONB, renal JSONB, adherence JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ger_polypharm ENABLE ROW LEVEL SECURITY;
ALTER TABLE ger_polypharm FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ger_polypharm_tenant_isolation ON ger_polypharm;
CREATE POLICY ger_polypharm_tenant_isolation ON ger_polypharm USING (tenant_id = current_setting('app.tenant_id', true));
