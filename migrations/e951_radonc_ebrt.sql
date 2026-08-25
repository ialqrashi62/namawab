CREATE TABLE IF NOT EXISTS radonc_ebrt (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_radonc_ebrt_t ON radonc_ebrt(tenant_id, patient_id);
ALTER TABLE radonc_ebrt ENABLE ROW LEVEL SECURITY;
ALTER TABLE radonc_ebrt FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_radonc_ebrt_t ON radonc_ebrt;
CREATE POLICY p_radonc_ebrt_t ON radonc_ebrt USING (tenant_id = current_setting('app.tenant_id', true));