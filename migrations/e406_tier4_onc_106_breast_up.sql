-- e406 TIER4_ONC-106 Breast Cancer
CREATE TABLE IF NOT EXISTS tier4_onc_106_breast_subtype (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  er TEXT,
  pr TEXT,
  her2 TEXT,
  ki67_pct NUMERIC,
  subtype TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_106_breast_subtype ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_106_breast_subtype FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_106_breast_subtype_t ON tier4_onc_106_breast_subtype;
CREATE POLICY tier4_onc_106_breast_subtype_t ON tier4_onc_106_breast_subtype
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_onc_106_breast_genetic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  brca_status TEXT,
  first_degree_relative BOOLEAN,
  age_at_diagnosis INT,
  high_risk BOOLEAN,
  plan TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_106_breast_genetic ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_106_breast_genetic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_106_breast_genetic_t ON tier4_onc_106_breast_genetic;
CREATE POLICY tier4_onc_106_breast_genetic_t ON tier4_onc_106_breast_genetic
  USING (tenant_id = current_setting('app.tenant_id', true));