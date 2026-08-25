-- e473 TIER4_DENT-103 Ortho
CREATE TABLE IF NOT EXISTS tier4_dent_103_ortho_malocclusion (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  angle_class TEXT NOT NULL,
  overjet_mm NUMERIC NOT NULL,
  overbite_mm NUMERIC NOT NULL,
  crossbite BOOLEAN,
  crowding_mm NUMERIC NOT NULL,
  complexity TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_dent_103_ortho_malocclusion ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_dent_103_ortho_malocclusion FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_dent_103_ortho_malocclusion_t ON tier4_dent_103_ortho_malocclusion;
CREATE POLICY tier4_dent_103_ortho_malocclusion_t ON tier4_dent_103_ortho_malocclusion
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_dent_103_ortho_growth (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  cvms TEXT NOT NULL,
  skeletal_class TEXT NOT NULL,
  intervention TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_dent_103_ortho_growth ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_dent_103_ortho_growth FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_dent_103_ortho_growth_t ON tier4_dent_103_ortho_growth;
CREATE POLICY tier4_dent_103_ortho_growth_t ON tier4_dent_103_ortho_growth
  USING (tenant_id = current_setting('app.tenant_id', true));