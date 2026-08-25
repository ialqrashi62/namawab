-- e418 TIER4_INFECT-102 HIV
CREATE TABLE IF NOT EXISTS tier4_infect_102_hiv_art (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cd4 NUMERIC NOT NULL,
  viral_load NUMERIC,
  hla_b5701 TEXT,
  hepatitis_b_co_infection BOOLEAN,
  pregnancy BOOLEAN,
  readiness TEXT,
  regimen TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_102_hiv_art ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_102_hiv_art FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_102_hiv_art_t ON tier4_infect_102_hiv_art;
CREATE POLICY tier4_infect_102_hiv_art_t ON tier4_infect_102_hiv_art
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_infect_102_hiv_opportunistic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cd4 NUMERIC,
  toxoplasma_igg TEXT,
  prophylaxis TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_102_hiv_opportunistic ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_102_hiv_opportunistic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_102_hiv_opportunistic_t ON tier4_infect_102_hiv_opportunistic;
CREATE POLICY tier4_infect_102_hiv_opportunistic_t ON tier4_infect_102_hiv_opportunistic
  USING (tenant_id = current_setting('app.tenant_id', true));