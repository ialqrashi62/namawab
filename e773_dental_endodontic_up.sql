CREATE TABLE IF NOT EXISTS dental_endodontic (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dental_endodontic_t ON dental_endodontic(tenant_id, patient_id);
ALTER TABLE dental_endodontic ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_endodontic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_dental_endodontic_t ON dental_endodontic;
CREATE POLICY p_dental_endodontic_t ON dental_endodontic USING (tenant_id = current_setting('app.tenant_id', true));
