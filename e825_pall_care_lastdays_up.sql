CREATE TABLE IF NOT EXISTS pall_care_lastdays (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pall_care_lastdays_t ON pall_care_lastdays(tenant_id, patient_id);
ALTER TABLE pall_care_lastdays ENABLE ROW LEVEL SECURITY;
ALTER TABLE pall_care_lastdays FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pall_care_lastdays_t ON pall_care_lastdays;
CREATE POLICY p_pall_care_lastdays_t ON pall_care_lastdays USING (tenant_id = current_setting('app.tenant_id', true));
