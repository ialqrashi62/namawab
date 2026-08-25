-- e177 TIER3_INFECT-302 Antimicrobial Stewardship UP
CREATE TABLE IF NOT EXISTS antibiotic_prescriptions (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  prescription_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  drug_name VARCHAR(100),
  indication TEXT,
  duration_days INTEGER,
  de_escalated BOOLEAN,
  iv_to_po_converted BOOLEAN,
  restricted_approved BOOLEAN,
  prescriber_id INTEGER,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE antibiotic_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE antibiotic_prescriptions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS abx_p_tenant_isolation ON antibiotic_prescriptions;
CREATE POLICY abx_p_tenant_isolation ON antibiotic_prescriptions
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));