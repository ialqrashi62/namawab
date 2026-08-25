-- e770 tier5 imaging ir
CREATE TABLE IF NOT EXISTS imaging_ir (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_imir_t ON imaging_ir(tenant_id, patient_id);
ALTER TABLE imaging_ir ENABLE ROW LEVEL SECURITY;
ALTER TABLE imaging_ir FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_imir_t ON imaging_ir;
CREATE POLICY p_imir_t ON imaging_ir USING (tenant_id = current_setting('app.tenant_id', true));
