-- e448 TIER4_RAD-103 Neuro Imaging
CREATE TABLE IF NOT EXISTS tier4_rad_103_neuro_stroke (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  nihss INT NOT NULL,
  last_known_well_hr NUMERIC NOT NULL,
  ct_hyperdense BOOLEAN,
  perfusion_mismatch BOOLEAN,
  hemorrhage BOOLEAN,
  severity TEXT,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rad_103_neuro_stroke ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_103_neuro_stroke FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rad_103_neuro_stroke_t ON tier4_rad_103_neuro_stroke;
CREATE POLICY tier4_rad_103_neuro_stroke_t ON tier4_rad_103_neuro_stroke
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rad_103_neuro_headtrauma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  gcs INT NOT NULL,
  loss_of_consciousness BOOLEAN,
  vomiting BOOLEAN,
  anticoagulation BOOLEAN,
  age INT NOT NULL,
  rule_out TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rad_103_neuro_headtrauma ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_103_neuro_headtrauma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rad_103_neuro_headtrauma_t ON tier4_rad_103_neuro_headtrauma;
CREATE POLICY tier4_rad_103_neuro_headtrauma_t ON tier4_rad_103_neuro_headtrauma
  USING (tenant_id = current_setting('app.tenant_id', true));