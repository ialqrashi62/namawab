-- TIER4_RAD_EXT2-105: Contrast Safety
CREATE TABLE IF NOT EXISTS tier4_rad_ext2_105_contrast (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  egfr NUMERIC,
  metformin BOOLEAN,
  reaction_severity TEXT,
  result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE tier4_rad_ext2_105_contrast ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_ext2_105_contrast FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t_rls ON tier4_rad_ext2_105_contrast;
CREATE POLICY t_rls ON tier4_rad_ext2_105_contrast USING (tenant_id = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS idx_tier4_rad_ext2_105 ON tier4_rad_ext2_105_contrast(tenant_id, patient_id);