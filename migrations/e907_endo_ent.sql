CREATE TABLE IF NOT EXISTS endo_ent (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_endo_ent_t ON endo_ent(tenant_id, patient_id);
ALTER TABLE endo_ent ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_ent FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_endo_ent_t ON endo_ent;
CREATE POLICY p_endo_ent_t ON endo_ent USING (tenant_id = current_setting('app.tenant_id', true));