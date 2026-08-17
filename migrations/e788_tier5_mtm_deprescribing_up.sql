-- e788 tier5 mtm deprescribing
CREATE TABLE IF NOT EXISTS mtm_deprescribing (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mdpr_t ON mtm_deprescribing(tenant_id, patient_id);
ALTER TABLE mtm_deprescribing ENABLE ROW LEVEL SECURITY;
ALTER TABLE mtm_deprescribing FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_mdpr_t ON mtm_deprescribing;
CREATE POLICY p_mdpr_t ON mtm_deprescribing USING (tenant_id = current_setting('app.tenant_id', true));
