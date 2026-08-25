-- e372 TIER4_GI-104 Biliary (choledocholithiasis, cholecystitis, PSC)
CREATE TABLE IF NOT EXISTS tier4_gi_104_biliary_choledocholithiasis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cbd_diameter_mm NUMERIC,
  bilirubin NUMERIC,
  alk_phos NUMERIC,
  fever BOOLEAN,
  charcot_triad BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_104_biliary_choledocholithiasis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_104_biliary_choledocholithiasis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_104_biliary_choledocholithiasis_t ON tier4_gi_104_biliary_choledocholithiasis;
CREATE POLICY tier4_gi_104_biliary_choledocholithiasis_t ON tier4_gi_104_biliary_choledocholithiasis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_104_biliary_cholecystitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  tokyo_grade TEXT,
  murphy BOOLEAN,
  wbc NUMERIC,
  surgery TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_104_biliary_cholecystitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_104_biliary_cholecystitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_104_biliary_cholecystitis_t ON tier4_gi_104_biliary_cholecystitis;
CREATE POLICY tier4_gi_104_biliary_cholecystitis_t ON tier4_gi_104_biliary_cholecystitis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_104_biliary_psc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  alk_phos NUMERIC,
  fibroscan_kpa NUMERIC,
  mayo_risk TEXT,
  surveillance TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_104_biliary_psc ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_104_biliary_psc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_104_biliary_psc_t ON tier4_gi_104_biliary_psc;
CREATE POLICY tier4_gi_104_biliary_psc_t ON tier4_gi_104_biliary_psc
  USING (tenant_id = current_setting('app.tenant_id', true));