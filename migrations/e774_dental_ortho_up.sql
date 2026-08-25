CREATE TABLE IF NOT EXISTS dental_ortho (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dental_ortho_t ON dental_ortho(tenant_id, patient_id);
ALTER TABLE dental_ortho ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_ortho FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_dental_ortho_t ON dental_ortho;
CREATE POLICY p_dental_ortho_t ON dental_ortho USING (tenant_id = current_setting('app.tenant_id', true));
