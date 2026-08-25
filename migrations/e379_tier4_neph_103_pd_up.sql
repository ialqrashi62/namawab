-- e379 TIER4_NEPH-103 Peritoneal Dialysis
CREATE TABLE IF NOT EXISTS tier4_neph_103_pd_adequacy (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  weekly_kt_v NUMERIC NOT NULL,
  crcl_l_wk NUMERIC,
  modality TEXT,
  adequate TEXT,
  plan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_103_pd_adequacy ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_103_pd_adequacy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_103_pd_adequacy_t ON tier4_neph_103_pd_adequacy;
CREATE POLICY tier4_neph_103_pd_adequacy_t ON tier4_neph_103_pd_adequacy
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_neph_103_pd_peritonitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  wbc_per_mm3 NUMERIC NOT NULL,
  polymorph_pct TEXT,
  cloudy_effluent BOOLEAN,
  abdominal_pain BOOLEAN,
  suspected TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_103_pd_peritonitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_103_pd_peritonitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_103_pd_peritonitis_t ON tier4_neph_103_pd_peritonitis;
CREATE POLICY tier4_neph_103_pd_peritonitis_t ON tier4_neph_103_pd_peritonitis
  USING (tenant_id = current_setting('app.tenant_id', true));