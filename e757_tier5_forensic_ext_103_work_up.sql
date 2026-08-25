CREATE TABLE IF NOT EXISTS occ_injury (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  injury_type TEXT NOT NULL,
  osha_recordable BOOLEAN NOT NULL,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_oi_t ON occ_injury(tenant_id, patient_id);
ALTER TABLE occ_injury ENABLE ROW LEVEL SECURITY;
ALTER TABLE occ_injury FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_oi_t ON occ_injury;
CREATE POLICY p_oi_t ON occ_injury USING (tenant_id = current_setting('app.tenant_id', true));
