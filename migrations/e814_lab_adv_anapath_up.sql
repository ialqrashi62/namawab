CREATE TABLE IF NOT EXISTS lab_adv_anapath (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_lab_adv_anapath_t ON lab_adv_anapath(tenant_id, patient_id);
ALTER TABLE lab_adv_anapath ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_adv_anapath FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_lab_adv_anapath_t ON lab_adv_anapath;
CREATE POLICY p_lab_adv_anapath_t ON lab_adv_anapath USING (tenant_id = current_setting('app.tenant_id', true));
