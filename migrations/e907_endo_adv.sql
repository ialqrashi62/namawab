CREATE TABLE IF NOT EXISTS endo_adv (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_endo_adv_t ON endo_adv(tenant_id, patient_id);
ALTER TABLE endo_adv ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_adv FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_endo_adv_t ON endo_adv;
CREATE POLICY p_endo_adv_t ON endo_adv USING (tenant_id = current_setting('app.tenant_id', true));