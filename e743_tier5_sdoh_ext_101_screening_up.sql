CREATE TABLE IF NOT EXISTS sdoh_screening (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sd101_t ON sdoh_screening(tenant_id, patient_id);
ALTER TABLE sdoh_screening ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdoh_screening FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_sd101_t ON sdoh_screening;
CREATE POLICY p_sd101_t ON sdoh_screening USING (tenant_id = current_setting('app.tenant_id', true));
