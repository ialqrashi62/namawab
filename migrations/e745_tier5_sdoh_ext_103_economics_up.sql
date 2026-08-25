CREATE TABLE IF NOT EXISTS sdoh_economics (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sd103_t ON sdoh_economics(tenant_id, patient_id);
ALTER TABLE sdoh_economics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdoh_economics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_sd103_t ON sdoh_economics;
CREATE POLICY p_sd103_t ON sdoh_economics USING (tenant_id = current_setting('app.tenant_id', true));
