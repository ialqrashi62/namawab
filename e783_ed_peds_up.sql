CREATE TABLE IF NOT EXISTS ed_peds (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ed_peds_t ON ed_peds(tenant_id, patient_id);
ALTER TABLE ed_peds ENABLE ROW LEVEL SECURITY;
ALTER TABLE ed_peds FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ed_peds_t ON ed_peds;
CREATE POLICY p_ed_peds_t ON ed_peds USING (tenant_id = current_setting('app.tenant_id', true));
