-- e485 TIER4_ANESTH-103 Regional
CREATE TABLE IF NOT EXISTS tier4_anesth_103_neuro_neuraxial (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  inr NUMERIC NOT NULL,
  platelet NUMERIC NOT NULL,
  on_anticoagulation BOOLEAN,
  infection_at_site BOOLEAN,
  icp_elevated BOOLEAN,
  patient_refusal BOOLEAN,
  safe TEXT,
  recommendation TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_anesth_103_neuro_neuraxial ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_anesth_103_neuro_neuraxial FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_anesth_103_neuro_neuraxial_t ON tier4_anesth_103_neuro_neuraxial;
CREATE POLICY tier4_anesth_103_neuro_neuraxial_t ON tier4_anesth_103_neuro_neuraxial
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_anesth_103_peripheral_block (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  procedure TEXT NOT NULL,
  anticoagulated BOOLEAN,
  allergy_lido BOOLEAN,
  block TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_anesth_103_peripheral_block ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_anesth_103_peripheral_block FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_anesth_103_peripheral_block_t ON tier4_anesth_103_peripheral_block;
CREATE POLICY tier4_anesth_103_peripheral_block_t ON tier4_anesth_103_peripheral_block
  USING (tenant_id = current_setting('app.tenant_id', true));