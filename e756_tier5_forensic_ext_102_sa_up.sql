CREATE TABLE IF NOT EXISTS forensic_sa (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  triage TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fsa_t ON forensic_sa(tenant_id, patient_id);
ALTER TABLE forensic_sa ENABLE ROW LEVEL SECURITY;
ALTER TABLE forensic_sa FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_fsa_t ON forensic_sa;
CREATE POLICY p_fsa_t ON forensic_sa USING (tenant_id = current_setting('app.tenant_id', true));
