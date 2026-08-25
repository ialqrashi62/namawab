-- e484 TIER4_ANESTH-102 ASA Class
CREATE TABLE IF NOT EXISTS tier4_anesth_102_asa_class (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  dm BOOLEAN,
  smoker BOOLEAN,
  bmi NUMERIC NOT NULL,
  mi_history BOOLEAN,
  chronic_renal BOOLEAN,
  morbid_obesity BOOLEAN,
  severe_sepsis BOOLEAN,
  moribund BOOLEAN,
  brain_dead BOOLEAN,
  asa TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_anesth_102_asa_class ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_anesth_102_asa_class FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_anesth_102_asa_class_t ON tier4_anesth_102_asa_class;
CREATE POLICY tier4_anesth_102_asa_class_t ON tier4_anesth_102_asa_class
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_anesth_102_asa_preop (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  asa TEXT NOT NULL,
  surgery_type TEXT NOT NULL,
  fasting_clear TEXT,
  lab_minimal TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_anesth_102_asa_preop ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_anesth_102_asa_preop FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_anesth_102_asa_preop_t ON tier4_anesth_102_asa_preop;
CREATE POLICY tier4_anesth_102_asa_preop_t ON tier4_anesth_102_asa_preop
  USING (tenant_id = current_setting('app.tenant_id', true));