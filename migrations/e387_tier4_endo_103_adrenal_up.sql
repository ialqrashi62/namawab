-- e387 TIER4_ENDO-103 Adrenal
CREATE TABLE IF NOT EXISTS tier4_endo_103_adrenal_insufficiency (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cortisol_am NUMERIC NOT NULL,
  acth NUMERIC,
  etiology TEXT,
  adrenal_crisis BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_103_adrenal_insufficiency ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_103_adrenal_insufficiency FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_103_adrenal_insufficiency_t ON tier4_endo_103_adrenal_insufficiency;
CREATE POLICY tier4_endo_103_adrenal_insufficiency_t ON tier4_endo_103_adrenal_insufficiency
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_endo_103_adrenal_cushing (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cortisol_24h_urinary_ug NUMERIC,
  acth NUMERIC,
  dex_suppression TEXT,
  salivary_cortisol TEXT,
  cushing TEXT,
  etiology TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_103_adrenal_cushing ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_103_adrenal_cushing FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_103_adrenal_cushing_t ON tier4_endo_103_adrenal_cushing;
CREATE POLICY tier4_endo_103_adrenal_cushing_t ON tier4_endo_103_adrenal_cushing
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_endo_103_adrenal_pheo (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  normetanephrine NUMERIC,
  metanephrine NUMERIC,
  sbp NUMERIC,
  classic_triad BOOLEAN,
  confirmed BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_103_adrenal_pheo ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_103_adrenal_pheo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_103_adrenal_pheo_t ON tier4_endo_103_adrenal_pheo;
CREATE POLICY tier4_endo_103_adrenal_pheo_t ON tier4_endo_103_adrenal_pheo
  USING (tenant_id = current_setting('app.tenant_id', true));