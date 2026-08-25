CREATE TABLE IF NOT EXISTS hh_infusion (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  ordr JSONB, access JSONB, admin JSONB, lab JSONB, adr JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE hh_infusion ENABLE ROW LEVEL SECURITY;
ALTER TABLE hh_infusion FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hh_infusion_tenant_isolation ON hh_infusion;
CREATE POLICY hh_infusion_tenant_isolation ON hh_infusion USING (tenant_id = current_setting('app.tenant_id', true));
