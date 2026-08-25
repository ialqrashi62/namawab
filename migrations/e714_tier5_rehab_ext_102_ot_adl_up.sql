-- filepath: e714_tier5_rehab_ext_102_ot_adl_up.sql
CREATE TABLE IF NOT EXISTS ot_session (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  activity TEXT NOT NULL,
  independence INT NOT NULL,
  session_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ot_t_pat ON ot_session(tenant_id, patient_id);
ALTER TABLE ot_session ENABLE ROW LEVEL SECURITY;
ALTER TABLE ot_session FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ot_t ON ot_session;
CREATE POLICY p_ot_t ON ot_session USING (tenant_id = current_setting('app.tenant_id', true));
