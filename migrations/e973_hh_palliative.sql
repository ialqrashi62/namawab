CREATE TABLE IF NOT EXISTS hh_palliative (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  consult JSONB, pain JSONB, goals JSONB, snon JSONB, coord JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE hh_palliative ENABLE ROW LEVEL SECURITY;
ALTER TABLE hh_palliative FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hh_palliative_tenant_isolation ON hh_palliative;
CREATE POLICY hh_palliative_tenant_isolation ON hh_palliative USING (tenant_id = current_setting('app.tenant_id', true));
