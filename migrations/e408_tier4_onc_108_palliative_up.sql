-- e408 TIER4_ONC-108 Palliative & Supportive
CREATE TABLE IF NOT EXISTS tier4_onc_108_palliative_pain (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pain_score_0_10 NUMERIC NOT NULL,
  etiology TEXT,
  prior_opioid BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_108_palliative_pain ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_108_palliative_pain FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_108_palliative_pain_t ON tier4_onc_108_palliative_pain;
CREATE POLICY tier4_onc_108_palliative_pain_t ON tier4_onc_108_palliative_pain
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_onc_108_palliative_cachexia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  weight_loss_pct_6mo NUMERIC NOT NULL,
  bmi NUMERIC,
  appetite TEXT,
  inflammation TEXT,
  severe BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_108_palliative_cachexia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_108_palliative_cachexia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_108_palliative_cachexia_t ON tier4_onc_108_palliative_cachexia;
CREATE POLICY tier4_onc_108_palliative_cachexia_t ON tier4_onc_108_palliative_cachexia
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_onc_108_palliative_hospice (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ecog_performance_status INT NOT NULL,
  prognosis TEXT,
  goals_of_care TEXT,
  eligible BOOLEAN,
  plan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_108_palliative_hospice ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_108_palliative_hospice FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_108_palliative_hospice_t ON tier4_onc_108_palliative_hospice;
CREATE POLICY tier4_onc_108_palliative_hospice_t ON tier4_onc_108_palliative_hospice
  USING (tenant_id = current_setting('app.tenant_id', true));