CREATE TABLE IF NOT EXISTS nephro_ped (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_nephro_ped_t ON nephro_ped(tenant_id, patient_id);
ALTER TABLE nephro_ped ENABLE ROW LEVEL SECURITY;
ALTER TABLE nephro_ped FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_nephro_ped_t ON nephro_ped;
CREATE POLICY p_nephro_ped_t ON nephro_ped USING (tenant_id = current_setting('app.tenant_id', true));