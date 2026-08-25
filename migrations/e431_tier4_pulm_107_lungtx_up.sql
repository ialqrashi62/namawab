-- e431 TIER4_PULM-107 Lung Tx
CREATE TABLE IF NOT EXISTS tier4_pulm_107_lungtx_candidate (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  indication TEXT,
  age INT NOT NULL,
  bmi NUMERIC NOT NULL,
  ecog INT NOT NULL,
  fvc_pct NUMERIC,
  dlco_pct NUMERIC,
  eligible BOOLEAN,
  referral TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_107_lungtx_candidate ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_107_lungtx_candidate FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_107_lungtx_candidate_t ON tier4_pulm_107_lungtx_candidate;
CREATE POLICY tier4_pulm_107_lungtx_candidate_t ON tier4_pulm_107_lungtx_candidate
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_pulm_107_lungtx_clad (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  current_fev1 NUMERIC NOT NULL,
  baseline_fev1 NUMERIC NOT NULL,
  fev1_drop_pct NUMERIC,
  clad_present BOOLEAN,
  phenotype TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_107_lungtx_clad ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_107_lungtx_clad FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_107_lungtx_clad_t ON tier4_pulm_107_lungtx_clad;
CREATE POLICY tier4_pulm_107_lungtx_clad_t ON tier4_pulm_107_lungtx_clad
  USING (tenant_id = current_setting('app.tenant_id', true));