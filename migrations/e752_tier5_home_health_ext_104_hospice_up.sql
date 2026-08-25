CREATE TABLE IF NOT EXISTS home_hospice (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  hospice_eligible BOOLEAN NOT NULL,
  election_date DATE NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_hh_t ON home_hospice(tenant_id, patient_id);
ALTER TABLE home_hospice ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_hospice FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_hh_t ON home_hospice;
CREATE POLICY p_hh_t ON home_hospice USING (tenant_id = current_setting('app.tenant_id', true));
