-- e283 TIER3_ONC-103 Febrile Neutropenia UP
CREATE TABLE IF NOT EXISTS onc_neutropenic_fever (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  episode_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  anc_cells_per_mm3 INTEGER,
  temperature_celsius NUMERIC(4,2),
  mascc_score INTEGER,
  risk_category VARCHAR(30),
  empiric_antibiotic VARCHAR(80),
  blood_cultures_drawn VARCHAR(5),
  gcsf_given VARCHAR(5),
  episode_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE onc_neutropenic_fever ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_neutropenic_fever FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onc_nf_tenant_isolation ON onc_neutropenic_fever;
CREATE POLICY onc_nf_tenant_isolation ON onc_neutropenic_fever
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));