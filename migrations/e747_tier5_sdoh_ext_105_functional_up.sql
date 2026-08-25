CREATE TABLE IF NOT EXISTS sdoh_function (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sd105_t ON sdoh_function(tenant_id, patient_id);
ALTER TABLE sdoh_function ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdoh_function FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_sd105_t ON sdoh_function;
CREATE POLICY p_sd105_t ON sdoh_function USING (tenant_id = current_setting('app.tenant_id', true));
