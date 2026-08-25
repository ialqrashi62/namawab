-- e432 TIER4_PULM-108 Pleural
CREATE TABLE IF NOT EXISTS tier4_pulm_108_pleural_effusion (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  type TEXT NOT NULL,
  size TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_108_pleural_effusion ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_108_pleural_effusion FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_108_pleural_effusion_t ON tier4_pulm_108_pleural_effusion;
CREATE POLICY tier4_pulm_108_pleural_effusion_t ON tier4_pulm_108_pleural_effusion
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_pulm_108_pleural_pneumothorax (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  size TEXT NOT NULL,
  ips_laterality TEXT,
  traumatic BOOLEAN,
  hemodynamically_unstable BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_108_pleural_pneumothorax ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_108_pleural_pneumothorax FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_108_pleural_pneumothorax_t ON tier4_pulm_108_pleural_pneumothorax;
CREATE POLICY tier4_pulm_108_pleural_pneumothorax_t ON tier4_pulm_108_pleural_pneumothorax
  USING (tenant_id = current_setting('app.tenant_id', true));