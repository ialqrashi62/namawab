CREATE TABLE IF NOT EXISTS ent_otology (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_ent_otology_t ON ent_otology(tenant_id, patient_id);
ALTER TABLE ent_otology ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_otology FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ent_otology_t ON ent_otology;
CREATE POLICY p_ent_otology_t ON ent_otology USING (tenant_id = current_setting('app.tenant_id', true));