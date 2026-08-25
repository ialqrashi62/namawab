-- e373 TIER4_GI-105 Pancreas (AP, CP, cyst)
CREATE TABLE IF NOT EXISTS tier4_gi_105_pancreas_ap (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  revised_severity TEXT NOT NULL,
  bisap INT,
  organ_failure TEXT,
  necrosis TEXT,
  therapy TEXT,
  procedure TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_105_pancreas_ap ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_105_pancreas_ap FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_105_pancreas_ap_t ON tier4_gi_105_pancreas_ap;
CREATE POLICY tier4_gi_105_pancreas_ap_t ON tier4_gi_105_pancreas_ap
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_105_pancreas_cp (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  etiology TEXT,
  calcifications BOOLEAN,
  pancreatogenic_diabetes BOOLEAN,
  steatorrhea BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_105_pancreas_cp ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_105_pancreas_cp FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_105_pancreas_cp_t ON tier4_gi_105_pancreas_cp;
CREATE POLICY tier4_gi_105_pancreas_cp_t ON tier4_gi_105_pancreas_cp
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_105_pancreas_cyst (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cyst_type TEXT,
  size_cm NUMERIC,
  surveillance TEXT,
  surgery TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_105_pancreas_cyst ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_105_pancreas_cyst FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_105_pancreas_cyst_t ON tier4_gi_105_pancreas_cyst;
CREATE POLICY tier4_gi_105_pancreas_cyst_t ON tier4_gi_105_pancreas_cyst
  USING (tenant_id = current_setting('app.tenant_id', true));