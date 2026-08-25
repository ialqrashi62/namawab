CREATE TABLE IF NOT EXISTS prehospital_ext_transport (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_prehospital_ext_transport_t ON prehospital_ext_transport(tenant_id, patient_id);
ALTER TABLE prehospital_ext_transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE prehospital_ext_transport FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_prehospital_ext_transport_t ON prehospital_ext_transport;
CREATE POLICY p_prehospital_ext_transport_t ON prehospital_ext_transport USING (tenant_id = current_setting('app.tenant_id', true));
