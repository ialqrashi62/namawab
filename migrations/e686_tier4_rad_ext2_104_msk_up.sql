-- TIER4_RAD_EXT2-104: MSK
CREATE TABLE IF NOT EXISTS tier4_rad_ext2_104_msk (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  location TEXT,
  displaced BOOLEAN,
  open_fracture BOOLEAN,
  result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE tier4_rad_ext2_104_msk ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_ext2_104_msk FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t_rls ON tier4_rad_ext2_104_msk;
CREATE POLICY t_rls ON tier4_rad_ext2_104_msk USING (tenant_id = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS idx_tier4_rad_ext2_104 ON tier4_rad_ext2_104_msk(tenant_id, patient_id);