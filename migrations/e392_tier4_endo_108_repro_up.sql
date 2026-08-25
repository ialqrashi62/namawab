-- e392 TIER4_ENDO-108 Reproductive Endocrinology
CREATE TABLE IF NOT EXISTS tier4_endo_108_repro_pcos (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cycle_length_days NUMERIC NOT NULL,
  hyperandrogenism BOOLEAN,
  polycystic_ovary BOOLEAN,
  bmi NUMERIC,
  phenotype TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_108_repro_pcos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_108_repro_pcos FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_108_repro_pcos_t ON tier4_endo_108_repro_pcos;
CREATE POLICY tier4_endo_108_repro_pcos_t ON tier4_endo_108_repro_pcos
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_endo_108_repro_hypogonadism (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  total_testosterone_ng_dl NUMERIC NOT NULL,
  lh NUMERIC,
  fsh NUMERIC,
  age INT NOT NULL,
  type TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_108_repro_hypogonadism ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_108_repro_hypogonadism FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_108_repro_hypogonadism_t ON tier4_endo_108_repro_hypogonadism;
CREATE POLICY tier4_endo_108_repro_hypogonadism_t ON tier4_endo_108_repro_hypogonadism
  USING (tenant_id = current_setting('app.tenant_id', true));