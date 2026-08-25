-- e407 TIER4_ONC-107 Lung Cancer
CREATE TABLE IF NOT EXISTS tier4_onc_107_lung_nsclc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  t INT NOT NULL,
  n INT NOT NULL,
  m INT NOT NULL,
  driver_mutation TEXT,
  pdl1_tps TEXT,
  stage TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_107_lung_nsclc ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_107_lung_nsclc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_107_lung_nsclc_t ON tier4_onc_107_lung_nsclc;
CREATE POLICY tier4_onc_107_lung_nsclc_t ON tier4_onc_107_lung_nsclc
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_onc_107_lung_sclc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  stage TEXT,
  brain_metastases BOOLEAN,
  performance_status TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_107_lung_sclc ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_107_lung_sclc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_107_lung_sclc_t ON tier4_onc_107_lung_sclc;
CREATE POLICY tier4_onc_107_lung_sclc_t ON tier4_onc_107_lung_sclc
  USING (tenant_id = current_setting('app.tenant_id', true));