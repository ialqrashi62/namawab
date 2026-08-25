CREATE TABLE IF NOT EXISTS wh_repro (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  workup JSONB, cycle JSONB, embryo JSONB, transfer JSONB, ivf_fu JSONB, followup JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE wh_repro ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_repro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS wh_repro_tenant_isolation ON wh_repro;
CREATE POLICY wh_repro_tenant_isolation ON wh_repro USING (tenant_id = current_setting('app.tenant_id', true));
