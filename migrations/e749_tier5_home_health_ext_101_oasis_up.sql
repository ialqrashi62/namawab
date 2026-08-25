CREATE TABLE IF NOT EXISTS home_oasis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  start_of_care_date DATE NOT NULL,
  primary_dx TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_hoc_t ON home_oasis(tenant_id, patient_id);
ALTER TABLE home_oasis ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_oasis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_hoc_t ON home_oasis;
CREATE POLICY p_hoc_t ON home_oasis USING (tenant_id = current_setting('app.tenant_id', true));
