-- e457 TIER4_PATH-105 Immuno
CREATE TABLE IF NOT EXISTS tier4_path_105_immuno_her2 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ihc_pattern TEXT NOT NULL,
  fish_ratio NUMERIC,
  ish_amplified TEXT,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_path_105_immuno_her2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_path_105_immuno_her2 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_path_105_immuno_her2_t ON tier4_path_105_immuno_her2;
CREATE POLICY tier4_path_105_immuno_her2_t ON tier4_path_105_immuno_her2
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_path_105_immuno_pdl1 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  tps NUMERIC NOT NULL,
  tumor_type TEXT NOT NULL,
  eligibility TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_path_105_immuno_pdl1 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_path_105_immuno_pdl1 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_path_105_immuno_pdl1_t ON tier4_path_105_immuno_pdl1;
CREATE POLICY tier4_path_105_immuno_pdl1_t ON tier4_path_105_immuno_pdl1
  USING (tenant_id = current_setting('app.tenant_id', true));