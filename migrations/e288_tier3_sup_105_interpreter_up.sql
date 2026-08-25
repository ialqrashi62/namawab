-- e288 TIER3_SUP-105 Language Interpreter Services UP
CREATE TABLE IF NOT EXISTS sup_interpreter_requests (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  request_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  primary_language VARCHAR(30),
  interpreter_type VARCHAR(20),
  encounter_type VARCHAR(40),
  request_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_time TIMESTAMPTZ
);
ALTER TABLE sup_interpreter_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_interpreter_requests FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_ir_tenant_isolation ON sup_interpreter_requests;
CREATE POLICY sup_ir_tenant_isolation ON sup_interpreter_requests
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));