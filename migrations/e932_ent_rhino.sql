CREATE TABLE IF NOT EXISTS ent_rhino (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_ent_rhino_t ON ent_rhino(tenant_id, patient_id);
ALTER TABLE ent_rhino ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_rhino FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ent_rhino_t ON ent_rhino;
CREATE POLICY p_ent_rhino_t ON ent_rhino USING (tenant_id = current_setting('app.tenant_id', true));