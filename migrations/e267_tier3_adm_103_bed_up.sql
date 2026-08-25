-- e267 TIER3_ADM-103 Bed Management UP
CREATE TABLE IF NOT EXISTS adm_beds (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  bed_id VARCHAR(50) UNIQUE NOT NULL,
  unit VARCHAR(40),
  room_number VARCHAR(20),
  bed_status VARCHAR(20),
  isolation_type VARCHAR(20),
  last_cleaned TIMESTAMPTZ,
  patient_id INTEGER
);
ALTER TABLE adm_beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_beds FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_b_tenant_isolation ON adm_beds;
CREATE POLICY adm_b_tenant_isolation ON adm_beds
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS adm_patient_transfers (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  transfer_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  from_unit VARCHAR(40),
  to_unit VARCHAR(40),
  transfer_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sbar_handoff VARCHAR(5),
  from_physician INTEGER,
  to_physician INTEGER
);
ALTER TABLE adm_patient_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_patient_transfers FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_pt_tenant_isolation ON adm_patient_transfers;
CREATE POLICY adm_pt_tenant_isolation ON adm_patient_transfers
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));