CREATE TABLE IF NOT EXISTS nutrition2_neonat (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_nutrition2_neonat_t ON nutrition2_neonat(tenant_id, patient_id);
ALTER TABLE nutrition2_neonat ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition2_neonat FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_nutrition2_neonat_t ON nutrition2_neonat;
CREATE POLICY p_nutrition2_neonat_t ON nutrition2_neonat USING (tenant_id = current_setting('app.tenant_id', true));
