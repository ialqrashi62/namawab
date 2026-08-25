-- filepath: e741_tier5_pain_ext_105_palliative_up.sql
CREATE TABLE IF NOT EXISTS palliative_care (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  status TEXT NOT NULL,
  pps_score INT NOT NULL,
  eligibility TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pct_t ON palliative_care(tenant_id, patient_id);
ALTER TABLE palliative_care ENABLE ROW LEVEL SECURITY;
ALTER TABLE palliative_care FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pct_t ON palliative_care;
CREATE POLICY p_pct_t ON palliative_care USING (tenant_id = current_setting('app.tenant_id', true));
