-- filepath: e722_tier5_psych_ext_104_bipolar_up.sql
CREATE TABLE IF NOT EXISTS bipolar_event (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  polarity TEXT NOT NULL,
  mania_severity TEXT,
  onset_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bip_t ON bipolar_event(tenant_id, patient_id);
ALTER TABLE bipolar_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE bipolar_event FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_bip_t ON bipolar_event;
CREATE POLICY p_bip_t ON bipolar_event USING (tenant_id = current_setting('app.tenant_id', true));
