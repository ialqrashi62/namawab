-- e445 TIER4_HEM-107 MPN
CREATE TABLE IF NOT EXISTS tier4_hem_107_mpn_stratify (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  hgb_g_dl NUMERIC,
  platelet NUMERIC,
  jak2 TEXT,
  risk TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hem_107_mpn_stratify ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hem_107_mpn_stratify FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hem_107_mpn_stratify_t ON tier4_hem_107_mpn_stratify;
CREATE POLICY tier4_hem_107_mpn_stratify_t ON tier4_hem_107_mpn_stratify
  USING (tenant_id = current_setting('app.tenant_id', true));