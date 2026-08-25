-- e463 TIER4_OPHTH-105 Neuro-Ophthalmology
CREATE TABLE IF NOT EXISTS tier4_ophth_105_neuro_neuritis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  vision_loss_age INT NOT NULL,
  pain_on_eye_movement BOOLEAN,
  afferent_pupil_defect BOOLEAN,
  visual_field_defect TEXT NOT NULL,
  impression TEXT,
  workup TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_105_neuro_neuritis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_105_neuro_neuritis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_105_neuro_neuritis_t ON tier4_ophth_105_neuro_neuritis;
CREATE POLICY tier4_ophth_105_neuro_neuritis_t ON tier4_ophth_105_neuro_neuritis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_ophth_105_neuro_papilledema (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  headache BOOLEAN,
  transient_visual_obscurations BOOLEAN,
  pulsatile_tinnitus BOOLEAN,
  visual_acuity NUMERIC NOT NULL,
  disc_oedema TEXT NOT NULL,
  oct_rnfl_thickness NUMERIC NOT NULL,
  action TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_105_neuro_papilledema ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_105_neuro_papilledema FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_105_neuro_papilledema_t ON tier4_ophth_105_neuro_papilledema;
CREATE POLICY tier4_ophth_105_neuro_papilledema_t ON tier4_ophth_105_neuro_papilledema
  USING (tenant_id = current_setting('app.tenant_id', true));