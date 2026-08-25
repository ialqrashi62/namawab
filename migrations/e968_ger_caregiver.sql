CREATE TABLE IF NOT EXISTS ger_caregiver (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  intake JSONB, burden JSONB, training JSONB, advance JSONB, hospice JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ger_caregiver ENABLE ROW LEVEL SECURITY;
ALTER TABLE ger_caregiver FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ger_caregiver_tenant_isolation ON ger_caregiver;
CREATE POLICY ger_caregiver_tenant_isolation ON ger_caregiver USING (tenant_id = current_setting('app.tenant_id', true));
