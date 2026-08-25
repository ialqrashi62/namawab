-- e420 TIER4_INFECT-104 Tropical/Travel
CREATE TABLE IF NOT EXISTS tier4_infect_104_tropical_malaria (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  species TEXT,
  severity TEXT,
  g6pd TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_104_tropical_malaria ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_104_tropical_malaria FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_104_tropical_malaria_t ON tier4_infect_104_tropical_malaria;
CREATE POLICY tier4_infect_104_tropical_malaria_t ON tier4_infect_104_tropical_malaria
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_infect_104_tropical_travel (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  destination TEXT,
  duration_weeks NUMERIC,
  yellow_fever TEXT,
  malaria_chemo TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_104_tropical_travel ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_104_tropical_travel FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_104_tropical_travel_t ON tier4_infect_104_tropical_travel;
CREATE POLICY tier4_infect_104_tropical_travel_t ON tier4_infect_104_tropical_travel
  USING (tenant_id = current_setting('app.tenant_id', true));