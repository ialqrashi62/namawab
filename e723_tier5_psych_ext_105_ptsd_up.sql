-- filepath: e723_tier5_psych_ext_105_ptsd_up.sql
CREATE TABLE IF NOT EXISTS ptsd_event (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  on_diagnosis DATE NOT NULL,
  therapy TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ptsd_t ON ptsd_event(tenant_id, patient_id);
ALTER TABLE ptsd_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE ptsd_event FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ptsd_t ON ptsd_event;
CREATE POLICY p_ptsd_t ON ptsd_event USING (tenant_id = current_setting('app.tenant_id', true));
