-- e425 TIER4_PULM-101 Asthma
CREATE TABLE IF NOT EXISTS tier4_pulm_101_asthma_control (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  act_score INT NOT NULL,
  fev1_pct NUMERIC,
  exacerbations_12mo INT,
  controlled BOOLEAN,
  step TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_101_asthma_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_101_asthma_control FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_101_asthma_control_t ON tier4_pulm_101_asthma_control;
CREATE POLICY tier4_pulm_101_asthma_control_t ON tier4_pulm_101_asthma_control
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_pulm_101_asthma_biologic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  eos_per_ul NUMERIC NOT NULL,
  ige_iu_ml NUMERIC,
  comorbid TEXT,
  biologic TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_101_asthma_biologic ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_101_asthma_biologic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_101_asthma_biologic_t ON tier4_pulm_101_asthma_biologic;
CREATE POLICY tier4_pulm_101_asthma_biologic_t ON tier4_pulm_101_asthma_biologic
  USING (tenant_id = current_setting('app.tenant_id', true));