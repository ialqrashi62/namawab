CREATE TABLE IF NOT EXISTS pall_care_goals (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pall_care_goals_t ON pall_care_goals(tenant_id, patient_id);
ALTER TABLE pall_care_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pall_care_goals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pall_care_goals_t ON pall_care_goals;
CREATE POLICY p_pall_care_goals_t ON pall_care_goals USING (tenant_id = current_setting('app.tenant_id', true));
