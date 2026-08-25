CREATE TABLE IF NOT EXISTS nephro_dialysis (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_nephro_dialysis_t ON nephro_dialysis(tenant_id, patient_id);
ALTER TABLE nephro_dialysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE nephro_dialysis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_nephro_dialysis_t ON nephro_dialysis;
CREATE POLICY p_nephro_dialysis_t ON nephro_dialysis USING (tenant_id = current_setting('app.tenant_id', true));