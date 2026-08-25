CREATE TABLE IF NOT EXISTS wh_obgyn (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id BIGINT NOT NULL,
  ant JSONB, exam JSONB, contra JSONB, sti JSONB, meno JSONB, postpat JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE wh_obgyn ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_obgyn FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS wh_obgyn_tenant_isolation ON wh_obgyn;
CREATE POLICY wh_obgyn_tenant_isolation ON wh_obgyn USING (tenant_id = current_setting('app.tenant_id', true));
