CREATE TABLE IF NOT EXISTS ent_head (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_ent_head_t ON ent_head(tenant_id, patient_id);
ALTER TABLE ent_head ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_head FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ent_head_t ON ent_head;
CREATE POLICY p_ent_head_t ON ent_head USING (tenant_id = current_setting('app.tenant_id', true));