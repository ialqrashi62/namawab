-- e469 TIER4_UROL-105 Male Infertility
CREATE TABLE IF NOT EXISTS tier4_urol_105_infert_semen (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  volume_ml NUMERIC NOT NULL,
  concentration_m_per_ml NUMERIC NOT NULL,
  motility_pct NUMERIC NOT NULL,
  morphology_pct NUMERIC NOT NULL,
  total_count_m NUMERIC,
  interpretation TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urol_105_infert_semen ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urol_105_infert_semen FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urol_105_infert_semen_t ON tier4_urol_105_infert_semen;
CREATE POLICY tier4_urol_105_infert_semen_t ON tier4_urol_105_infert_semen
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_urol_105_infert_varicocele (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  grade TEXT NOT NULL,
  abnormal_semen BOOLEAN,
  symptomatic BOOLEAN,
  testicular_atrophy BOOLEAN,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urol_105_infert_varicocele ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urol_105_infert_varicocele FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urol_105_infert_varicocele_t ON tier4_urol_105_infert_varicocele;
CREATE POLICY tier4_urol_105_infert_varicocele_t ON tier4_urol_105_infert_varicocele
  USING (tenant_id = current_setting('app.tenant_id', true));