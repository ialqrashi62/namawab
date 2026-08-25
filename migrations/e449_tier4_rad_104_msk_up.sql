-- e449 TIER4_RAD-104 MSK
CREATE TABLE IF NOT EXISTS tier4_rad_104_msk_ottawa (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  location TEXT NOT NULL,
  imaging TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rad_104_msk_ottawa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_104_msk_ottawa FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rad_104_msk_ottawa_t ON tier4_rad_104_msk_ottawa;
CREATE POLICY tier4_rad_104_msk_ottawa_t ON tier4_rad_104_msk_ottawa
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rad_104_msk_rotator (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  trauma BOOLEAN,
  painful_arc BOOLEAN,
  drop_arm BOOLEAN,
  weakness_external_rotation BOOLEAN,
  us_mri TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rad_104_msk_rotator ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_104_msk_rotator FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rad_104_msk_rotator_t ON tier4_rad_104_msk_rotator;
CREATE POLICY tier4_rad_104_msk_rotator_t ON tier4_rad_104_msk_rotator
  USING (tenant_id = current_setting('app.tenant_id', true));