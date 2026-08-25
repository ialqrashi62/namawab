-- e472 TIER4_DENT-102 Periodontal
CREATE TABLE IF NOT EXISTS tier4_dent_102_perio_stage (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  attachment_loss_mm NUMERIC NOT NULL,
  probing_depth_mm NUMERIC NOT NULL,
  bone_loss_pct NUMERIC NOT NULL,
  tooth_loss_due_to_perio NUMERIC NOT NULL,
  stage TEXT,
  grade TEXT,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_dent_102_perio_stage ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_dent_102_perio_stage FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_dent_102_perio_stage_t ON tier4_dent_102_perio_stage;
CREATE POLICY tier4_dent_102_perio_stage_t ON tier4_dent_102_perio_stage
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_dent_102_perio_gingivitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  bleeding_on_probing BOOLEAN,
  redness BOOLEAN,
  plaque TEXT NOT NULL,
  pregnancy BOOLEAN,
  diabetes BOOLEAN,
  severity TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_dent_102_perio_gingivitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_dent_102_perio_gingivitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_dent_102_perio_gingivitis_t ON tier4_dent_102_perio_gingivitis;
CREATE POLICY tier4_dent_102_perio_gingivitis_t ON tier4_dent_102_perio_gingivitis
  USING (tenant_id = current_setting('app.tenant_id', true));