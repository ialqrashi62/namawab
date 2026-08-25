CREATE TABLE IF NOT EXISTS ent_laryn (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_ent_laryn_t ON ent_laryn(tenant_id, patient_id);
ALTER TABLE ent_laryn ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_laryn FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ent_laryn_t ON ent_laryn;
CREATE POLICY p_ent_laryn_t ON ent_laryn USING (tenant_id = current_setting('app.tenant_id', true));