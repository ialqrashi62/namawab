-- e386 TIER4_ENDO-102 Thyroid
CREATE TABLE IF NOT EXISTS tier4_endo_102_thyroid_hypothyroid (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  tsh NUMERIC NOT NULL,
  t4_free NUMERIC NOT NULL,
  etiology TEXT,
  subclinical BOOLEAN,
  overt BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_102_thyroid_hypothyroid ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_102_thyroid_hypothyroid FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_102_thyroid_hypothyroid_t ON tier4_endo_102_thyroid_hypothyroid;
CREATE POLICY tier4_endo_102_thyroid_hypothyroid_t ON tier4_endo_102_thyroid_hypothyroid
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_endo_102_thyroid_hyperthyroid (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  tsh NUMERIC,
  t4_free NUMERIC,
  etiology TEXT,
  severity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_102_thyroid_hyperthyroid ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_102_thyroid_hyperthyroid FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_102_thyroid_hyperthyroid_t ON tier4_endo_102_thyroid_hyperthyroid;
CREATE POLICY tier4_endo_102_thyroid_hyperthyroid_t ON tier4_endo_102_thyroid_hyperthyroid
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_endo_102_thyroid_nodule (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  nodule_size_cm NUMERIC,
  tirads TEXT,
  fna_indicated BOOLEAN,
  plan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_102_thyroid_nodule ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_102_thyroid_nodule FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_102_thyroid_nodule_t ON tier4_endo_102_thyroid_nodule;
CREATE POLICY tier4_endo_102_thyroid_nodule_t ON tier4_endo_102_thyroid_nodule
  USING (tenant_id = current_setting('app.tenant_id', true));