-- filepath: e729_tier5_rare_ext_105_immuno_up.sql
CREATE TABLE IF NOT EXISTS immunodeficiencies (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  disease TEXT NOT NULL,
  ige_or_igg INT,
  classification TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_idd_t ON immunodeficiencies(tenant_id, disease);
ALTER TABLE immunodeficiencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE immunodeficiencies FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_idd_t ON immunodeficiencies;
CREATE POLICY p_idd_t ON immunodeficiencies USING (tenant_id = current_setting('app.tenant_id', true));
