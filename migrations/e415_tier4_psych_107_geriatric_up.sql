-- e415 TIER4_PSYCH-107 Geriatric
CREATE TABLE IF NOT EXISTS tier4_psych_107_geriatric_delirium (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cam_status TEXT NOT NULL,
  subtype TEXT,
  etiology TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_107_geriatric_delirium ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_107_geriatric_delirium FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_107_geriatric_delirium_t ON tier4_psych_107_geriatric_delirium;
CREATE POLICY tier4_psych_107_geriatric_delirium_t ON tier4_psych_107_geriatric_delirium
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_psych_107_geriatric_bpsd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  symptom TEXT,
  severity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_psych_107_geriatric_bpsd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_psych_107_geriatric_bpsd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_psych_107_geriatric_bpsd_t ON tier4_psych_107_geriatric_bpsd;
CREATE POLICY tier4_psych_107_geriatric_bpsd_t ON tier4_psych_107_geriatric_bpsd
  USING (tenant_id = current_setting('app.tenant_id', true));