CREATE TABLE IF NOT EXISTS infusion_pca (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_infusion_pca_t ON infusion_pca(tenant_id, patient_id);
ALTER TABLE infusion_pca ENABLE ROW LEVEL SECURITY;
ALTER TABLE infusion_pca FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_infusion_pca_t ON infusion_pca;
CREATE POLICY p_infusion_pca_t ON infusion_pca USING (tenant_id = current_setting('app.tenant_id', true));
