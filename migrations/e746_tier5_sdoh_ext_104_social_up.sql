CREATE TABLE IF NOT EXISTS sdoh_social (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sd104_t ON sdoh_social(tenant_id, patient_id);
ALTER TABLE sdoh_social ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdoh_social FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_sd104_t ON sdoh_social;
CREATE POLICY p_sd104_t ON sdoh_social USING (tenant_id = current_setting('app.tenant_id', true));
