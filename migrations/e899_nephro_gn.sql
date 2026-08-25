CREATE TABLE IF NOT EXISTS nephro_gn (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_nephro_gn_t ON nephro_gn(tenant_id, patient_id);
ALTER TABLE nephro_gn ENABLE ROW LEVEL SECURITY;
ALTER TABLE nephro_gn FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_nephro_gn_t ON nephro_gn;
CREATE POLICY p_nephro_gn_t ON nephro_gn USING (tenant_id = current_setting('app.tenant_id', true));