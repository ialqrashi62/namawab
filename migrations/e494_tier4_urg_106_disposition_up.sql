-- e494 TIER4_URG-106 Disposition
CREATE TABLE IF NOT EXISTS tier4_urg_106_disp_dc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ambulating BOOLEAN,
  tolerating_oral BOOLEAN,
  pain_controlled BOOLEAN,
  afebrile BOOLEAN,
  vitals_normal BOOLEAN,
  responsible_adult BOOLEAN,
  total NUMERIC,
  disposition TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urg_106_disp_dc ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urg_106_disp_dc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urg_106_disp_dc_t ON tier4_urg_106_disp_dc;
CREATE POLICY tier4_urg_106_disp_dc_t ON tier4_urg_106_disp_dc
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_urg_106_disp_admit (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  news2_score NUMERIC NOT NULL,
  social_factors BOOLEAN,
  decision TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urg_106_disp_admit ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urg_106_disp_admit FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urg_106_disp_admit_t ON tier4_urg_106_disp_admit;
CREATE POLICY tier4_urg_106_disp_admit_t ON tier4_urg_106_disp_admit
  USING (tenant_id = current_setting('app.tenant_id', true));