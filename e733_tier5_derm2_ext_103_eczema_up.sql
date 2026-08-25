-- filepath: e733_tier5_derm2_ext_103_eczema_up.sql
CREATE TABLE IF NOT EXISTS eczemadq (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  scrorad NUMERIC NOT NULL,
  eos_count INT,
  measured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ecz_t ON eczemadq(tenant_id, patient_id);
ALTER TABLE eczemadq ENABLE ROW LEVEL SECURITY;
ALTER TABLE eczemadq FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ecz_t ON eczemadq;
CREATE POLICY p_ecz_t ON eczemadq USING (tenant_id = current_setting('app.tenant_id', true));
