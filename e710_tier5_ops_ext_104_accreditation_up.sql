-- filepath: e710_tier5_ops_ext_104_accreditation_up.sql
-- TIER5_OPS_EXT-104: Accreditation scoring tables
CREATE TABLE IF NOT EXISTS accreditation_assessment (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  framework TEXT NOT NULL,
  chapter TEXT NOT NULL,
  standard_code TEXT NOT NULL,
  standard_name TEXT NOT NULL,
  compliance_score INT NOT NULL,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_accred_t_fw ON accreditation_assessment(tenant_id, framework);

ALTER TABLE accreditation_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE accreditation_assessment FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_accred_t ON accreditation_assessment;
CREATE POLICY p_accred_t ON accreditation_assessment USING (tenant_id = current_setting('app.tenant_id', true));
