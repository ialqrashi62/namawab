-- e523 TIER4_GYN_EXT-105 Pelvic Pain
CREATE TABLE IF NOT EXISTS tier4_gyn_ext_105_endomet (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  dysmenorrhea BOOLEAN,
  dyspareunia BOOLEAN,
  chronic_pain BOOLEAN,
  dyschezia BOOLEAN,
  infertility BOOLEAN,
  age NUMERIC NOT NULL,
  score NUMERIC,
  risk TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gyn_ext_105_endomet ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gyn_ext_105_endomet FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gyn_ext_105_endomet_t ON tier4_gyn_ext_105_endomet;
CREATE POLICY tier4_gyn_ext_105_endomet_t ON tier4_gyn_ext_105_endomet
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gyn_ext_105_pcos (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  oligo_ovulation BOOLEAN,
  hyperandrogenism BOOLEAN,
  polycystic_ovaries BOOLEAN,
  other_causes_excluded BOOLEAN,
  diagnosis TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gyn_ext_105_pcos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gyn_ext_105_pcos FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gyn_ext_105_pcos_t ON tier4_gyn_ext_105_pcos;
CREATE POLICY tier4_gyn_ext_105_pcos_t ON tier4_gyn_ext_105_pcos
  USING (tenant_id = current_setting('app.tenant_id', true));