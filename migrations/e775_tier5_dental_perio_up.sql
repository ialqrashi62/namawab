-- e775 tier5 dental perio
CREATE TABLE IF NOT EXISTS dental_perio (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dper_t ON dental_perio(tenant_id, patient_id);
ALTER TABLE dental_perio ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_perio FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_dper_t ON dental_perio;
CREATE POLICY p_dper_t ON dental_perio USING (tenant_id = current_setting('app.tenant_id', true));
