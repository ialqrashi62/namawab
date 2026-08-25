CREATE TABLE IF NOT EXISTS sdoh_literacy (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sd102_t ON sdoh_literacy(tenant_id, patient_id);
ALTER TABLE sdoh_literacy ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdoh_literacy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_sd102_t ON sdoh_literacy;
CREATE POLICY p_sd102_t ON sdoh_literacy USING (tenant_id = current_setting('app.tenant_id', true));
