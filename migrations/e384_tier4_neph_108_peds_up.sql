-- e384 TIER4_NEPH-108 Pediatric Nephrology
CREATE TABLE IF NOT EXISTS tier4_neph_108_peds_uti (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_years INT NOT NULL,
  fever BOOLEAN,
  pyuria BOOLEAN,
  culture TEXT,
  recurrent BOOLEAN,
  ultrasound TEXT,
  cystography_indicated BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_108_peds_uti ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_108_peds_uti FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_108_peds_uti_t ON tier4_neph_108_peds_uti;
CREATE POLICY tier4_neph_108_peds_uti_t ON tier4_neph_108_peds_uti
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_neph_108_peds_ns (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_years INT NOT NULL,
  proteinuria NUMERIC,
  serum_albumin NUMERIC,
  syndrome TEXT,
  diagnosis TEXT,
  therapy TEXT,
  frequent_relapser BOOLEAN,
  fr_therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_108_peds_ns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_108_peds_ns FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_108_peds_ns_t ON tier4_neph_108_peds_ns;
CREATE POLICY tier4_neph_108_peds_ns_t ON tier4_neph_108_peds_ns
  USING (tenant_id = current_setting('app.tenant_id', true));