-- e230 TIER3_DERM-305 Mohs UP
CREATE TABLE IF NOT EXISTS tier3_derm_mohs_cases (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  mohs_indicated BOOLEAN DEFAULT false,
  anticipated_stages INTEGER,
  reconstruction_plan TEXT,
  anesthesia_max_mg NUMERIC(7,2),
  complication_action TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_derm_mohs_tenant ON tier3_derm_mohs_cases(tenant_id);
ALTER TABLE tier3_derm_mohs_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_derm_mohs_cases FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_derm_mohs_t_tenant_isolation ON tier3_derm_mohs_cases;
CREATE POLICY tier3_derm_mohs_t_tenant_isolation ON tier3_derm_mohs_cases
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));