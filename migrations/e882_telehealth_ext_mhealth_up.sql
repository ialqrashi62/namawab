CREATE TABLE IF NOT EXISTS telehealth_ext_mhealth (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_telehealth_ext_mhealth_t ON telehealth_ext_mhealth(tenant_id, patient_id);
ALTER TABLE telehealth_ext_mhealth ENABLE ROW LEVEL SECURITY;
ALTER TABLE telehealth_ext_mhealth FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_telehealth_ext_mhealth_t ON telehealth_ext_mhealth;
CREATE POLICY p_telehealth_ext_mhealth_t ON telehealth_ext_mhealth USING (tenant_id = current_setting('app.tenant_id', true));
