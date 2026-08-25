CREATE TABLE IF NOT EXISTS cardiology_hf (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_cardiology_hf_t ON cardiology_hf(tenant_id, patient_id);
ALTER TABLE cardiology_hf ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardiology_hf FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_cardiology_hf_t ON cardiology_hf;
CREATE POLICY p_cardiology_hf_t ON cardiology_hf USING (tenant_id = current_setting('app.tenant_id', true));