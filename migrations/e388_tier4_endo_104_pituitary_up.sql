-- e388 TIER4_ENDO-104 Pituitary
CREATE TABLE IF NOT EXISTS tier4_endo_104_pituitary_prolactinoma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  prolactin_ng_ml NUMERIC NOT NULL,
  tumor_size TEXT,
  symptoms TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_104_pituitary_prolactinoma ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_104_pituitary_prolactinoma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_104_pituitary_prolactinoma_t ON tier4_endo_104_pituitary_prolactinoma;
CREATE POLICY tier4_endo_104_pituitary_prolactinoma_t ON tier4_endo_104_pituitary_prolactinoma
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_endo_104_pituitary_acromegaly (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  igf1 NUMERIC,
  gh NUMERIC,
  tumor_size TEXT,
  ogtt TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_104_pituitary_acromegaly ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_104_pituitary_acromegaly FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_104_pituitary_acromegaly_t ON tier4_endo_104_pituitary_acromegaly;
CREATE POLICY tier4_endo_104_pituitary_acromegaly_t ON tier4_endo_104_pituitary_acromegaly
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_endo_104_pituitary_hypopit (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cortisol_am NUMERIC,
  tsh NUMERIC,
  t4_free NUMERIC,
  acth TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_104_pituitary_hypopit ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_104_pituitary_hypopit FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_104_pituitary_hypopit_t ON tier4_endo_104_pituitary_hypopit;
CREATE POLICY tier4_endo_104_pituitary_hypopit_t ON tier4_endo_104_pituitary_hypopit
  USING (tenant_id = current_setting('app.tenant_id', true));