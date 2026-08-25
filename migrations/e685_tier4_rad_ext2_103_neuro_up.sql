-- TIER4_RAD_EXT2-103: Neuro
CREATE TABLE IF NOT EXISTS tier4_rad_ext2_103_neuro (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  gcs NUMERIC,
  nihss NUMERIC,
  hours_since_onset NUMERIC,
  ich_volume_ml NUMERIC,
  result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE tier4_rad_ext2_103_neuro ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rad_ext2_103_neuro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t_rls ON tier4_rad_ext2_103_neuro;
CREATE POLICY t_rls ON tier4_rad_ext2_103_neuro USING (tenant_id = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS idx_tier4_rad_ext2_103 ON tier4_rad_ext2_103_neuro(tenant_id, patient_id);