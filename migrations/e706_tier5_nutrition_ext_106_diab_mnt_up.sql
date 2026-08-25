-- TIER5_NUTRITION_EXT-106 Diabetes MNT
CREATE TABLE IF NOT EXISTS tier5_nutrition_ext_106_diab_mnt (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  bmi NUMERIC,
  kcal_per_day INT,
  pattern TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_nutrition_ext_106_diab_mnt ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_nutrition_ext_106_diab_mnt FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_nutrition_ext_106_diab_mnt_isolation ON tier5_nutrition_ext_106_diab_mnt;
CREATE POLICY tier5_nutrition_ext_106_diab_mnt_isolation ON tier5_nutrition_ext_106_diab_mnt
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));