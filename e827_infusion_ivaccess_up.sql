CREATE TABLE IF NOT EXISTS infusion_ivaccess (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_infusion_ivaccess_t ON infusion_ivaccess(tenant_id, patient_id);
ALTER TABLE infusion_ivaccess ENABLE ROW LEVEL SECURITY;
ALTER TABLE infusion_ivaccess FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_infusion_ivaccess_t ON infusion_ivaccess;
CREATE POLICY p_infusion_ivaccess_t ON infusion_ivaccess USING (tenant_id = current_setting('app.tenant_id', true));
