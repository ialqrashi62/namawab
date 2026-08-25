-- e492 TIER4_URG-104 Infection
CREATE TABLE IF NOT EXISTS tier4_urg_104_inf_sepsis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  temperature NUMERIC NOT NULL,
  hr NUMERIC NOT NULL,
  rr NUMERIC NOT NULL,
  sbp NUMERIC NOT NULL,
  lactate NUMERIC NOT NULL,
  mental_status TEXT NOT NULL,
  sirs NUMERIC,
  qsofa NUMERIC,
  risk TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urg_104_inf_sepsis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urg_104_inf_sepsis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urg_104_inf_sepsis_t ON tier4_urg_104_inf_sepsis;
CREATE POLICY tier4_urg_104_inf_sepsis_t ON tier4_urg_104_inf_sepsis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_urg_104_inf_cellulitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  size_area_cm NUMERIC NOT NULL,
  systemic_signs BOOLEAN,
  diabetic BOOLEAN,
  purulence BOOLEAN,
  bsa_pct NUMERIC NOT NULL,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urg_104_inf_cellulitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urg_104_inf_cellulitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urg_104_inf_cellulitis_t ON tier4_urg_104_inf_cellulitis;
CREATE POLICY tier4_urg_104_inf_cellulitis_t ON tier4_urg_104_inf_cellulitis
  USING (tenant_id = current_setting('app.tenant_id', true));