-- e440 TIER4_HEM-102 Hemoglobinopathies
CREATE TABLE IF NOT EXISTS tier4_hem_102_hemoglobin_sc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pain_nrs_0_10 NUMERIC NOT NULL,
  prior_sud BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hem_102_hemoglobin_sc ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hem_102_hemoglobin_sc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hem_102_hemoglobin_sc_t ON tier4_hem_102_hemoglobin_sc;
CREATE POLICY tier4_hem_102_hemoglobin_sc_t ON tier4_hem_102_hemoglobin_sc
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_hem_102_hemoglobin_thal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  ferritin NUMERIC,
  pre_tx_hgb_g_dl NUMERIC,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hem_102_hemoglobin_thal ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hem_102_hemoglobin_thal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hem_102_hemoglobin_thal_t ON tier4_hem_102_hemoglobin_thal;
CREATE POLICY tier4_hem_102_hemoglobin_thal_t ON tier4_hem_102_hemoglobin_thal
  USING (tenant_id = current_setting('app.tenant_id', true));