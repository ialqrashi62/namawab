-- e422 TIER4_INFECT-106 Bone/Joint ID
CREATE TABLE IF NOT EXISTS tier4_infect_106_bone_osteomyelitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  organism TEXT,
  site TEXT,
  diabetes BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_106_bone_osteomyelitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_106_bone_osteomyelitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_106_bone_osteomyelitis_t ON tier4_infect_106_bone_osteomyelitis;
CREATE POLICY tier4_infect_106_bone_osteomyelitis_t ON tier4_infect_106_bone_osteomyelitis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_infect_106_bone_septic_arthritis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  joint TEXT,
  organism TEXT,
  prosthetic BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_106_bone_septic_arthritis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_106_bone_septic_arthritis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_106_bone_septic_arthritis_t ON tier4_infect_106_bone_septic_arthritis;
CREATE POLICY tier4_infect_106_bone_septic_arthritis_t ON tier4_infect_106_bone_septic_arthritis
  USING (tenant_id = current_setting('app.tenant_id', true));