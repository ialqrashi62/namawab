-- filepath: e732_tier5_derm2_ext_102_psor_up.sql
CREATE TABLE IF NOT EXISTS psor_dq (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pasi_total NUMERIC NOT NULL,
  dlqi INT NOT NULL,
  biologic TEXT,
  measured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_psd_t ON psor_dq(tenant_id, patient_id);
ALTER TABLE psor_dq ENABLE ROW LEVEL SECURITY;
ALTER TABLE psor_dq FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_psd_t ON psor_dq;
CREATE POLICY p_psd_t ON psor_dq USING (tenant_id = current_setting('app.tenant_id', true));
