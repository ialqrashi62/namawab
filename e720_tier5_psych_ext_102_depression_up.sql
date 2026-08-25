-- filepath: e720_tier5_psych_ext_102_depression_up.sql
CREATE TABLE IF NOT EXISTS depression_care (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  phq9_total INT NOT NULL,
  antidepressant TEXT NOT NULL,
  prescribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dep_c_t ON depression_care(tenant_id, patient_id);
ALTER TABLE depression_care ENABLE ROW LEVEL SECURITY;
ALTER TABLE depression_care FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_dep_c_t ON depression_care;
CREATE POLICY p_dep_c_t ON depression_care USING (tenant_id = current_setting('app.tenant_id', true));
