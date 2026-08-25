-- e433 TIER4_PALL-101 Pain (WHO Ladder)
CREATE TABLE IF NOT EXISTS tier4_pall_101_pain_ladder (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  pain_nrs_0_10 NUMERIC NOT NULL,
  pain_type TEXT,
  prior_step TEXT,
  renal_impairment BOOLEAN,
  step TEXT,
  adjuvant TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pall_101_pain_ladder ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pall_101_pain_ladder FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pall_101_pain_ladder_t ON tier4_pall_101_pain_ladder;
CREATE POLICY tier4_pall_101_pain_ladder_t ON tier4_pall_101_pain_ladder
  USING (tenant_id = current_setting('app.tenant_id', true));