-- e454 TIER4_PATH-102 Cancer Screening
CREATE TABLE IF NOT EXISTS tier4_path_102_screen_cervical (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  hpv_status TEXT NOT NULL,
  cytology TEXT NOT NULL,
  interval TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_path_102_screen_cervical ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_path_102_screen_cervical FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_path_102_screen_cervical_t ON tier4_path_102_screen_cervical;
CREATE POLICY tier4_path_102_screen_cervical_t ON tier4_path_102_screen_cervical
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_path_102_screen_breast (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  family_history BOOLEAN,
  brca_carrier BOOLEAN,
  previous_biopsy_atypia BOOLEAN,
  recommendation TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_path_102_screen_breast ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_path_102_screen_breast FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_path_102_screen_breast_t ON tier4_path_102_screen_breast;
CREATE POLICY tier4_path_102_screen_breast_t ON tier4_path_102_screen_breast
  USING (tenant_id = current_setting('app.tenant_id', true));