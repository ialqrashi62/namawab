-- e476 TIER4_DENT-106 Oral Surgery
CREATE TABLE IF NOT EXISTS tier4_dent_106_oms_thirdmolar (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  angulation TEXT NOT NULL,
  depth TEXT NOT NULL,
  symptoms BOOLEAN,
  pericoronitis BOOLEAN,
  caries BOOLEAN,
  cyst_tumor BOOLEAN,
  intervention TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_dent_106_oms_thirdmolar ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_dent_106_oms_thirdmolar FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_dent_106_oms_thirdmolar_t ON tier4_dent_106_oms_thirdmolar;
CREATE POLICY tier4_dent_106_oms_thirdmolar_t ON tier4_dent_106_oms_thirdmolar
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_dent_106_oms_fracture (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  fracture_type TEXT NOT NULL,
  displacement TEXT NOT NULL,
  occlusion_disturbed BOOLEAN,
  open BOOLEAN,
  management TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_dent_106_oms_fracture ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_dent_106_oms_fracture FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_dent_106_oms_fracture_t ON tier4_dent_106_oms_fracture;
CREATE POLICY tier4_dent_106_oms_fracture_t ON tier4_dent_106_oms_fracture
  USING (tenant_id = current_setting('app.tenant_id', true));