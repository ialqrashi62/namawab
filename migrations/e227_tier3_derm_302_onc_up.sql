-- e227 TIER3_DERM-302 Dermatologic Oncology UP
CREATE TABLE IF NOT EXISTS tier3_derm_onc_cases (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  melanoma_stage_group TEXT,
  melanoma_margin_cm NUMERIC(3,1),
  bcc_treatment TEXT,
  scc_stage_group TEXT,
  mcc_stage TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_derm_onc_tenant ON tier3_derm_onc_cases(tenant_id);
ALTER TABLE tier3_derm_onc_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_derm_onc_cases FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_derm_onc_t_tenant_isolation ON tier3_derm_onc_cases;
CREATE POLICY tier3_derm_onc_t_tenant_isolation ON tier3_derm_onc_cases
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));