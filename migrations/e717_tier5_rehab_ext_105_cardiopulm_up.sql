-- filepath: e717_tier5_rehab_ext_105_cardiopulm_up.sql
CREATE TABLE IF NOT EXISTS rehab_program (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  program_type TEXT NOT NULL,
  risk_stratum TEXT NOT NULL,
  met_level NUMERIC NOT NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rehab_p_t ON rehab_program(tenant_id, program_type);
ALTER TABLE rehab_program ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_program FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_rehab_p_t ON rehab_program;
CREATE POLICY p_rehab_p_t ON rehab_program USING (tenant_id = current_setting('app.tenant_id', true));
