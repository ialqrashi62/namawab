-- e241 TIER3_URO-301 Stone UP
CREATE TABLE IF NOT EXISTS tier3_uro_stone_cases (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  colic_severity TEXT,
  first_choice_treatment TEXT,
  eswl_vs_urs TEXT,
  prevention_abnormalities TEXT,
  stent_removal_indicated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_uro_stone_tenant ON tier3_uro_stone_cases(tenant_id);
ALTER TABLE tier3_uro_stone_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_uro_stone_cases FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_uro_stone_t_tenant_isolation ON tier3_uro_stone_cases;
CREATE POLICY tier3_uro_stone_t_tenant_isolation ON tier3_uro_stone_cases
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));