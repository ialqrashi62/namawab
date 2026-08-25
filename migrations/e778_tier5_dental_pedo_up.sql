-- e778 tier5 dental pedo
CREATE TABLE IF NOT EXISTS dental_pedo (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dpedo_t ON dental_pedo(tenant_id, patient_id);
ALTER TABLE dental_pedo ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_pedo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_dpedo_t ON dental_pedo;
CREATE POLICY p_dpedo_t ON dental_pedo USING (tenant_id = current_setting('app.tenant_id', true));
