-- e426 TIER4_PULM-102 COPD
CREATE TABLE IF NOT EXISTS tier4_pulm_102_copd_gold (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  fev1_pct NUMERIC NOT NULL,
  mmrc INT,
  cat_score INT,
  exacerbations_12mo INT,
  hospitalized_12mo BOOLEAN,
  grade TEXT,
  risk_group TEXT,
  symptom_group TEXT,
  classification TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_102_copd_gold ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_102_copd_gold FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_102_copd_gold_t ON tier4_pulm_102_copd_gold;
CREATE POLICY tier4_pulm_102_copd_gold_t ON tier4_pulm_102_copd_gold
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_pulm_102_copd_exac (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  severity TEXT NOT NULL,
  copd_related BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_102_copd_exac ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_102_copd_exac FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_102_copd_exac_t ON tier4_pulm_102_copd_exac;
CREATE POLICY tier4_pulm_102_copd_exac_t ON tier4_pulm_102_copd_exac
  USING (tenant_id = current_setting('app.tenant_id', true));