-- Note: e432 was used for pleural - need e432a or shift
CREATE TABLE IF NOT EXISTS tier4_pall_102_communication_goals (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  prior_discussion TEXT,
  family_understanding TEXT,
  surrogate_documented BOOLEAN,
  plan TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pall_102_communication_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pall_102_communication_goals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pall_102_communication_goals_t ON tier4_pall_102_communication_goals;
CREATE POLICY tier4_pall_102_communication_goals_t ON tier4_pall_102_communication_goals
  USING (tenant_id = current_setting('app.tenant_id', true));