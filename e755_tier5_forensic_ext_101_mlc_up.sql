CREATE TABLE IF NOT EXISTS mlc_case (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  case_type TEXT NOT NULL,
  mle_registered_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mlc_t ON mlc_case(tenant_id, case_id);
ALTER TABLE mlc_case ENABLE ROW LEVEL SECURITY;
ALTER TABLE mlc_case FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_mlc_t ON mlc_case;
CREATE POLICY p_mlc_t ON mlc_case USING (tenant_id = current_setting('app.tenant_id', true));
