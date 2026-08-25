-- filepath: e736_tier5_derm2_ext_106_wounds_up.sql
CREATE TABLE IF NOT EXISTS wound_record (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  wound_type TEXT NOT NULL,
  braden_score INT,
  visit_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_wr_t ON wound_record(tenant_id, wound_type);
ALTER TABLE wound_record ENABLE ROW LEVEL SECURITY;
ALTER TABLE wound_record FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_wr_t ON wound_record;
CREATE POLICY p_wr_t ON wound_record USING (tenant_id = current_setting('app.tenant_id', true));
