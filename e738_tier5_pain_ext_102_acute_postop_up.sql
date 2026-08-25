-- filepath: e738_tier5_pain_ext_102_acute_postop_up.sql
CREATE TABLE IF NOT EXISTS acute_pain (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  surgery TEXT NOT NULL,
  acute_pain_phase TEXT NOT NULL,
  plan TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ap_t ON acute_pain(tenant_id, patient_id);
ALTER TABLE acute_pain ENABLE ROW LEVEL SECURITY;
ALTER TABLE acute_pain FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ap_t ON acute_pain;
CREATE POLICY p_ap_t ON acute_pain USING (tenant_id = current_setting('app.tenant_id', true));
