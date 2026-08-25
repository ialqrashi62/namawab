CREATE TABLE IF NOT EXISTS quality_safety_ext_sentinel (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_quality_safety_ext_sentinel_t ON quality_safety_ext_sentinel(tenant_id, patient_id);
ALTER TABLE quality_safety_ext_sentinel ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_safety_ext_sentinel FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_quality_safety_ext_sentinel_t ON quality_safety_ext_sentinel;
CREATE POLICY p_quality_safety_ext_sentinel_t ON quality_safety_ext_sentinel USING (tenant_id = current_setting('app.tenant_id', true));
