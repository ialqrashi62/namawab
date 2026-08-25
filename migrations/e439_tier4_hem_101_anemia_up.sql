-- e439 TIER4_HEM-101 Anemia
CREATE TABLE IF NOT EXISTS tier4_hem_101_anemia_workup (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  hgb_g_dl NUMERIC NOT NULL,
  mcv_fl NUMERIC NOT NULL,
  retic_pct NUMERIC NOT NULL,
  ferritin NUMERIC NOT NULL,
  b12 NUMERIC NOT NULL,
  classification TEXT,
  iron_status TEXT,
  b12_status TEXT,
  bone_marrow_response TEXT,
  etiology_hint TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hem_101_anemia_workup ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hem_101_anemia_workup FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hem_101_anemia_workup_t ON tier4_hem_101_anemia_workup;
CREATE POLICY tier4_hem_101_anemia_workup_t ON tier4_hem_101_anemia_workup
  USING (tenant_id = current_setting('app.tenant_id', true));