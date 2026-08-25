-- e471 TIER4_DENT-101 Caries
CREATE TABLE IF NOT EXISTS tier4_dent_101_carries_risk (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  past_caries NUMERIC NOT NULL,
  dmft NUMERIC NOT NULL,
  dmft_score NUMERIC,
  sugar_intake TEXT NOT NULL,
  fluoride BOOLEAN,
  saliva_flow TEXT NOT NULL,
  age INT NOT NULL,
  risk TEXT,
  rec_intervals TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_dent_101_carries_risk ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_dent_101_carries_risk FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_dent_101_carries_risk_t ON tier4_dent_101_carries_risk;
CREATE POLICY tier4_dent_101_carries_risk_t ON tier4_dent_101_carries_risk
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_dent_101_pulp (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pain TEXT NOT NULL,
  test_cold TEXT NOT NULL,
  radiolucency BOOLEAN,
  mobility TEXT NOT NULL,
  diagnosis TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_dent_101_pulp ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_dent_101_pulp FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_dent_101_pulp_t ON tier4_dent_101_pulp;
CREATE POLICY tier4_dent_101_pulp_t ON tier4_dent_101_pulp
  USING (tenant_id = current_setting('app.tenant_id', true));