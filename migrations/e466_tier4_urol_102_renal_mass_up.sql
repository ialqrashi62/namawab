-- e466 TIER4_UROL-102 Renal Mass
CREATE TABLE IF NOT EXISTS tier4_urol_102_renal_mass (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  size_cm NUMERIC NOT NULL,
  enhancement TEXT NOT NULL,
  solid BOOLEAN,
  nephrometry TEXT,
  action TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urol_102_renal_mass ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urol_102_renal_mass FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urol_102_renal_mass_t ON tier4_urol_102_renal_mass;
CREATE POLICY tier4_urol_102_renal_mass_t ON tier4_urol_102_renal_mass
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_urol_102_hematuria (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  gross BOOLEAN,
  microscopic BOOLEAN,
  age INT NOT NULL,
  smoker BOOLEAN,
  irritative BOOLEAN,
  pain BOOLEAN,
  workup TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_urol_102_hematuria ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_urol_102_hematuria FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_urol_102_hematuria_t ON tier4_urol_102_hematuria;
CREATE POLICY tier4_urol_102_hematuria_t ON tier4_urol_102_hematuria
  USING (tenant_id = current_setting('app.tenant_id', true));