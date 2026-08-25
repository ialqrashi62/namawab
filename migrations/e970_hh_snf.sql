CREATE TABLE IF NOT EXISTS hh_snf (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  tr JSONB, med JSONB, visit JSONB, risk JSONB, rehab JSONB, close JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE hh_snf ENABLE ROW LEVEL SECURITY;
ALTER TABLE hh_snf FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hh_snf_tenant_isolation ON hh_snf;
CREATE POLICY hh_snf_tenant_isolation ON hh_snf USING (tenant_id = current_setting('app.tenant_id', true));
