-- e437 TIER4_PALL-106 Peds
CREATE TABLE IF NOT EXISTS tier4_pall_106_peds_peds (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_years INT NOT NULL,
  diagnosis_group TEXT,
  complexity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pall_106_peds_peds ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pall_106_peds_peds FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pall_106_peds_peds_t ON tier4_pall_106_peds_peds;
CREATE POLICY tier4_pall_106_peds_peds_t ON tier4_pall_106_peds_peds
  USING (tenant_id = current_setting('app.tenant_id', true));