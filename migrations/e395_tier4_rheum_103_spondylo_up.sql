-- e395 TIER4_RHEUM-103 Spondyloarthropathy
CREATE TABLE IF NOT EXISTS tier4_rheum_103_spondylo_axial (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  back_pain_years NUMERIC NOT NULL,
  age_onset_back_pain INT NOT NULL,
  hla_b27 TEXT,
  mri_sacroiliitis TEXT,
  enthesitis BOOLEAN,
  uveitis BOOLEAN,
  psoriasis BOOLEAN,
  ibd BOOLEAN,
  axis_count INT,
  diagnosis TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_103_spondylo_axial ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_103_spondylo_axial FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_103_spondylo_axial_t ON tier4_rheum_103_spondylo_axial;
CREATE POLICY tier4_rheum_103_spondylo_axial_t ON tier4_rheum_103_spondylo_axial
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rheum_103_spondylo_peripheral (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  subtype TEXT,
  dactylitis BOOLEAN,
  enthesitis BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_103_spondylo_peripheral ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_103_spondylo_peripheral FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_103_spondylo_peripheral_t ON tier4_rheum_103_spondylo_peripheral;
CREATE POLICY tier4_rheum_103_spondylo_peripheral_t ON tier4_rheum_103_spondylo_peripheral
  USING (tenant_id = current_setting('app.tenant_id', true));