-- e416 TIER4_PSYCH-108 Child & Adolescent
CREATE TABLE IF NOT EXISTS tier4_psych_108_cap_adhd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_years INT NOT NULL,
  symptom_count INT NOT NULL,
  subtype TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_108_cap_adhd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_108_cap_adhd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_108_cap_adhd_t ON tier4_psych_108_cap_adhd;
CREATE POLICY tier4_psych_108_cap_adhd_t ON tier4_psych_108_cap_adhd
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_psych_108_cap_asd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_years INT NOT NULL,
  ados_score TEXT,
  comorbidity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_108_cap_asd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_108_cap_asd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_108_cap_asd_t ON tier4_psych_108_cap_asd;
CREATE POLICY tier4_psych_108_cap_asd_t ON tier4_psych_108_cap_asd
  USING (tenant_id = current_setting('app.tenant_id', true));