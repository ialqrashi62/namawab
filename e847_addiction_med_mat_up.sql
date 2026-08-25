CREATE TABLE IF NOT EXISTS addiction_med_mat (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_addiction_med_mat_t ON addiction_med_mat(tenant_id, patient_id);
ALTER TABLE addiction_med_mat ENABLE ROW LEVEL SECURITY;
ALTER TABLE addiction_med_mat FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_addiction_med_mat_t ON addiction_med_mat;
CREATE POLICY p_addiction_med_mat_t ON addiction_med_mat USING (tenant_id = current_setting('app.tenant_id', true));
