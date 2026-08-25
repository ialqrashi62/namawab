-- e389 TIER4_ENDO-105 Bone & Calcium
CREATE TABLE IF NOT EXISTS tier4_endo_105_bone_osteoporosis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  sex TEXT,
  t_score NUMERIC NOT NULL,
  prior_fracture BOOLEAN,
  parental_hip_fracture BOOLEAN,
  chronic_steroid BOOLEAN,
  fragility_fracture_risk BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_105_bone_osteoporosis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_105_bone_osteoporosis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_105_bone_osteoporosis_t ON tier4_endo_105_bone_osteoporosis;
CREATE POLICY tier4_endo_105_bone_osteoporosis_t ON tier4_endo_105_bone_osteoporosis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_endo_105_bone_hypercalcemia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  corrected_calcium NUMERIC NOT NULL,
  pth NUMERIC,
  vit_d_25_oh NUMERIC,
  etiology TEXT,
  severity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_105_bone_hypercalcemia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_105_bone_hypercalcemia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_105_bone_hypercalcemia_t ON tier4_endo_105_bone_hypercalcemia;
CREATE POLICY tier4_endo_105_bone_hypercalcemia_t ON tier4_endo_105_bone_hypercalcemia
  USING (tenant_id = current_setting('app.tenant_id', true));