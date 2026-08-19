-- filepath: migrations/e999-g148_womens_peds_ext.sql
CREATE TABLE IF NOT EXISTS tier128_womens_660 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  visit_id TEXT, cc_id TEXT, meno_id TEXT, if_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier128_womens_660 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier128_womens_660 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t128_wn_660_isolation ON tier128_womens_660;
CREATE POLICY t128_wn_660_isolation ON tier128_womens_660 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier128_maternal_661 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  hr_id TEXT, gdm_id TEXT, pe_id TEXT, nst_id TEXT, bpp_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier128_maternal_661 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier128_maternal_661 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t128_mt_661_isolation ON tier128_maternal_661;
CREATE POLICY t128_mt_661_isolation ON tier128_maternal_661 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier128_pediatric_662 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  visit_id TEXT, vacc_id TEXT, nbs_id TEXT, feed_id TEXT, gc_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier128_pediatric_662 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier128_pediatric_662 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t128_pd_662_isolation ON tier128_pediatric_662;
CREATE POLICY t128_pd_662_isolation ON tier128_pediatric_662 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier128_neonatal_663 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  adm_id TEXT, apgar_id TEXT, pt_id TEXT, kc_id TEXT, dc_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier128_neonatal_663 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier128_neonatal_663 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t128_nn_663_isolation ON tier128_neonatal_663;
CREATE POLICY t128_nn_663_isolation ON tier128_neonatal_663 USING (tenant_id = current_setting('app.tenant_id', true));