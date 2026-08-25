CREATE TABLE IF NOT EXISTS hh_adl (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  plan JSONB, visit JSONB, burden JSONB, safe JSONB, rcf JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE hh_adl ENABLE ROW LEVEL SECURITY;
ALTER TABLE hh_adl FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hh_adl_tenant_isolation ON hh_adl;
CREATE POLICY hh_adl_tenant_isolation ON hh_adl USING (tenant_id = current_setting('app.tenant_id', true));
