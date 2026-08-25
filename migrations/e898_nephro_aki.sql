CREATE TABLE IF NOT EXISTS nephro_aki (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_nephro_aki_t ON nephro_aki(tenant_id, patient_id);
ALTER TABLE nephro_aki ENABLE ROW LEVEL SECURITY;
ALTER TABLE nephro_aki FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_nephro_aki_t ON nephro_aki;
CREATE POLICY p_nephro_aki_t ON nephro_aki USING (tenant_id = current_setting('app.tenant_id', true));