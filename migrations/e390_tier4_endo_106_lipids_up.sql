-- e390 TIER4_ENDO-106 Lipids
CREATE TABLE IF NOT EXISTS tier4_endo_106_lipids_ldl (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ldl_mg_dl NUMERIC NOT NULL,
  ascvd_risk TEXT,
  diabetes BOOLEAN,
  statin_tolerated TEXT,
  target TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_106_lipids_ldl ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_106_lipids_ldl FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_106_lipids_ldl_t ON tier4_endo_106_lipids_ldl;
CREATE POLICY tier4_endo_106_lipids_ldl_t ON tier4_endo_106_lipids_ldl
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_endo_106_lipids_statin_intolerance (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  symptom TEXT,
  ck NUMERIC,
  alt NUMERIC,
  severity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_106_lipids_statin_intolerance ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_106_lipids_statin_intolerance FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_106_lipids_statin_intolerance_t ON tier4_endo_106_lipids_statin_intolerance;
CREATE POLICY tier4_endo_106_lipids_statin_intolerance_t ON tier4_endo_106_lipids_statin_intolerance
  USING (tenant_id = current_setting('app.tenant_id', true));