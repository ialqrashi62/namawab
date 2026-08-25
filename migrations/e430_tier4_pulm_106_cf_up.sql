-- e430 TIER4_PULM-106 CF
CREATE TABLE IF NOT EXISTS tier4_pulm_106_cf_modulator (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_years INT NOT NULL,
  mutation TEXT,
  fvc_pct NUMERIC,
  fev1_pct NUMERIC,
  modulator TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_106_cf_modulator ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_106_cf_modulator FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_106_cf_modulator_t ON tier4_pulm_106_cf_modulator;
CREATE POLICY tier4_pulm_106_cf_modulator_t ON tier4_pulm_106_cf_modulator
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_pulm_106_cf_exac (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  organism TEXT,
  severity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_106_cf_exac ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_106_cf_exac FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_106_cf_exac_t ON tier4_pulm_106_cf_exac;
CREATE POLICY tier4_pulm_106_cf_exac_t ON tier4_pulm_106_cf_exac
  USING (tenant_id = current_setting('app.tenant_id', true));