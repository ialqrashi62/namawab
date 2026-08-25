-- e777 tier5 dental oral_surg
CREATE TABLE IF NOT EXISTS dental_oral_surg (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dorsg_t ON dental_oral_surg(tenant_id, patient_id);
ALTER TABLE dental_oral_surg ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_oral_surg FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_dorsg_t ON dental_oral_surg;
CREATE POLICY p_dorsg_t ON dental_oral_surg USING (tenant_id = current_setting('app.tenant_id', true));
