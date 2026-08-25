-- e771 tier5 imaging nuc
CREATE TABLE IF NOT EXISTS imaging_nuc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_imnuc_t ON imaging_nuc(tenant_id, patient_id);
ALTER TABLE imaging_nuc ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_nuc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_imnuc_t ON imaging_nuc;
CREATE POLICY p_imnuc_t ON imaging_nuc USING (tenant_id = current_setting('app.tenant_id', true));
