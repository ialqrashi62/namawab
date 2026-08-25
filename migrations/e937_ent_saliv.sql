CREATE TABLE IF NOT EXISTS ent_saliv (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_ent_saliv_t ON ent_saliv(tenant_id, patient_id);
ALTER TABLE ent_saliv ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_saliv FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ent_saliv_t ON ent_saliv;
CREATE POLICY p_ent_saliv_t ON ent_saliv USING (tenant_id = current_setting('app.tenant_id', true));