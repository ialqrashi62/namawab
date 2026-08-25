-- e403 TIER4_ONC-103 Stem Cell Transplant
CREATE TABLE IF NOT EXISTS tier4_onc_103_sct_type (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  indication TEXT,
  donor TEXT,
  age INT,
  comorbidity TEXT,
  candidate TEXT,
  conditioning TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_103_sct_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_103_sct_type FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_103_sct_type_t ON tier4_onc_103_sct_type;
CREATE POLICY tier4_onc_103_sct_type_t ON tier4_onc_103_sct_type
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_onc_103_sct_gvhd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  organ TEXT,
  overall_grade TEXT,
  type TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_103_sct_gvhd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_103_sct_gvhd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_103_sct_gvhd_t ON tier4_onc_103_sct_gvhd;
CREATE POLICY tier4_onc_103_sct_gvhd_t ON tier4_onc_103_sct_gvhd
  USING (tenant_id = current_setting('app.tenant_id', true));