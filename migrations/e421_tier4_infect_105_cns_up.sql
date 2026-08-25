-- e421 TIER4_INFECT-105 CNS ID
CREATE TABLE IF NOT EXISTS tier4_infect_105_cns_meningitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  etiology TEXT,
  csf_opening_pressure NUMERIC,
  csf_wbc NUMERIC,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_105_cns_meningitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_105_cns_meningitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_105_cns_meningitis_t ON tier4_infect_105_cns_meningitis;
CREATE POLICY tier4_infect_105_cns_meningitis_t ON tier4_infect_105_cns_meningitis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_infect_105_cns_encephalitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  etiology TEXT,
  consciousness TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_105_cns_encephalitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_105_cns_encephalitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_105_cns_encephalitis_t ON tier4_infect_105_cns_encephalitis;
CREATE POLICY tier4_infect_105_cns_encephalitis_t ON tier4_infect_105_cns_encephalitis
  USING (tenant_id = current_setting('app.tenant_id', true));