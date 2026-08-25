-- e474 TIER4_DENT-104 Endodontic
CREATE TABLE IF NOT EXISTS tier4_dent_104_endo_complexity (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  tooth_type TEXT NOT NULL,
  curvature NUMERIC NOT NULL,
  calcification TEXT NOT NULL,
  previous_treatment BOOLEAN,
  complexity TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_dent_104_endo_complexity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_dent_104_endo_complexity FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_dent_104_endo_complexity_t ON tier4_dent_104_endo_complexity;
CREATE POLICY tier4_dent_104_endo_complexity_t ON tier4_dent_104_endo_complexity
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_dent_104_endo_periapical (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pain TEXT NOT NULL,
  radiolucency BOOLEAN,
  size_mm NUMERIC NOT NULL,
  swelling BOOLEAN,
  diagnosis TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_dent_104_endo_periapical ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_dent_104_endo_periapical FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_dent_104_endo_periapical_t ON tier4_dent_104_endo_periapical;
CREATE POLICY tier4_dent_104_endo_periapical_t ON tier4_dent_104_endo_periapical
  USING (tenant_id = current_setting('app.tenant_id', true));