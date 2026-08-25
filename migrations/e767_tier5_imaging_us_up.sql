-- e767 tier5 imaging us
CREATE TABLE IF NOT EXISTS imaging_us (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_imus_t ON imaging_us(tenant_id, patient_id);
ALTER TABLE imaging_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_us FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_imus_t ON imaging_us;
CREATE POLICY p_imus_t ON imaging_us USING (tenant_id = current_setting('app.tenant_id', true));
