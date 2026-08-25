CREATE TABLE IF NOT EXISTS ed_resus (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ed_resus_t ON ed_resus(tenant_id, patient_id);
ALTER TABLE ed_resus ENABLE ROW LEVEL SECURITY;
ALTER TABLE ed_resus FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ed_resus_t ON ed_resus;
CREATE POLICY p_ed_resus_t ON ed_resus USING (tenant_id = current_setting('app.tenant_id', true));
