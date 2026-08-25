CREATE TABLE IF NOT EXISTS ed_tox (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ed_tox_t ON ed_tox(tenant_id, patient_id);
ALTER TABLE ed_tox ENABLE ROW LEVEL SECURITY;
ALTER TABLE ed_tox FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ed_tox_t ON ed_tox;
CREATE POLICY p_ed_tox_t ON ed_tox USING (tenant_id = current_setting('app.tenant_id', true));
