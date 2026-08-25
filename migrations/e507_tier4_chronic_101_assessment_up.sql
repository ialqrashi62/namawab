-- e507 TIER4_CHRONIC-101 Assessment
CREATE TABLE IF NOT EXISTS tier4_chronic_101_assess_severity (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  diagnosis TEXT NOT NULL,
  hba1c NUMERIC,
  fev1 NUMERIC,
  ef NUMERIC,
  gfr NUMERIC,
  child NUMERIC,
  severity TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_chronic_101_assess_severity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_chronic_101_assess_severity FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_chronic_101_assess_severity_t ON tier4_chronic_101_assess_severity;
CREATE POLICY tier4_chronic_101_assess_severity_t ON tier4_chronic_101_assess_severity
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_chronic_101_assess_adl (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  bathing NUMERIC NOT NULL,
  dressing NUMERIC NOT NULL,
  toileting NUMERIC NOT NULL,
  transferring NUMERIC NOT NULL,
  continence NUMERIC NOT NULL,
  feeding NUMERIC NOT NULL,
  total NUMERIC,
  dependency TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_chronic_101_assess_adl ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_chronic_101_assess_adl FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_chronic_101_assess_adl_t ON tier4_chronic_101_assess_adl;
CREATE POLICY tier4_chronic_101_assess_adl_t ON tier4_chronic_101_assess_adl
  USING (tenant_id = current_setting('app.tenant_id', true));