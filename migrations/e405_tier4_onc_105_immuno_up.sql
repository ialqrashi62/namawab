-- e405 TIER4_ONC-105 Immuno-Oncology
CREATE TABLE IF NOT EXISTS tier4_onc_105_immuno_irae (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  organ TEXT NOT NULL,
  ctcae_grade TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_105_immuno_irae ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_105_immuno_irae FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_105_immuno_irae_t ON tier4_onc_105_immuno_irae;
CREATE POLICY tier4_onc_105_immuno_irae_t ON tier4_onc_105_immuno_irae
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_onc_105_immuno_selection (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  tumor TEXT,
  biomarker TEXT,
  regimen TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_onc_105_immuno_selection ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_onc_105_immuno_selection FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_onc_105_immuno_selection_t ON tier4_onc_105_immuno_selection;
CREATE POLICY tier4_onc_105_immuno_selection_t ON tier4_onc_105_immuno_selection
  USING (tenant_id = current_setting('app.tenant_id', true));