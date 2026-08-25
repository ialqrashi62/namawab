-- e291 TIER3_SUP-108 Environmental Services / Housekeeping UP
CREATE TABLE IF NOT EXISTS sup_cleaning_log (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  cleaning_id VARCHAR(50) UNIQUE NOT NULL,
  room_id VARCHAR(50) NOT NULL,
  cleaning_type VARCHAR(30),
  isolation_required VARCHAR(5),
  uv_disinfection_used VARCHAR(5),
  atp_rlu_score INTEGER,
  cleaning_time_min INTEGER,
  cleaned_by VARCHAR(60),
  cleaned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sup_cleaning_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_cleaning_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_cl_tenant_isolation ON sup_cleaning_log;
CREATE POLICY sup_cl_tenant_isolation ON sup_cleaning_log
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));