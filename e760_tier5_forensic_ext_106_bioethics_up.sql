CREATE TABLE IF NOT EXISTS bioethics (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  issue TEXT NOT NULL,
  decision TEXT NOT NULL,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_be_t ON bioethics(tenant_id, patient_id);
ALTER TABLE bioethics ENABLE ROW LEVEL SECURITY;
ALTER TABLE bioethics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_be_t ON bioethics;
CREATE POLICY p_be_t ON bioethics USING (tenant_id = current_setting('app.tenant_id', true));
