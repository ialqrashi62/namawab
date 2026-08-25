-- e397 TIER4_RHEUM-105 Myositis & ASS
CREATE TABLE IF NOT EXISTS tier4_rheum_105_myositis_iim (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ck NUMERIC,
  aldolase NUMERIC,
  proximal_weakness BOOLEAN,
  msa_status TEXT,
  dyspnea BOOLEAN,
  suspicion BOOLEAN,
  therapy TEXT,
  mri TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_105_myositis_iim ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_105_myositis_iim FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_105_myositis_iim_t ON tier4_rheum_105_myositis_iim;
CREATE POLICY tier4_rheum_105_myositis_iim_t ON tier4_rheum_105_myositis_iim
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rheum_105_myositis_ass (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ab TEXT,
  triad_components INT,
  diagnosis TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rheum_105_myositis_ass ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rheum_105_myositis_ass FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rheum_105_myositis_ass_t ON tier4_rheum_105_myositis_ass;
CREATE POLICY tier4_rheum_105_myositis_ass_t ON tier4_rheum_105_myositis_ass
  USING (tenant_id = current_setting('app.tenant_id', true));