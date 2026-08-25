-- e479 TIER4_REHAB-103 Ortho
CREATE TABLE IF NOT EXISTS tier4_rehab_103_ortho_tkr (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  days_post_op NUMERIC NOT NULL,
  rom_degrees NUMERIC NOT NULL,
  pain_level NUMERIC NOT NULL,
  phase TEXT,
  rom_target TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rehab_103_ortho_tkr ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rehab_103_ortho_tkr FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rehab_103_ortho_tkr_t ON tier4_rehab_103_ortho_tkr;
CREATE POLICY tier4_rehab_103_ortho_tkr_t ON tier4_rehab_103_ortho_tkr
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rehab_103_ortho_shoulder (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  weeks_since_repair NUMERIC NOT NULL,
  motion TEXT NOT NULL,
  pain NUMERIC NOT NULL,
  phase TEXT,
  precaution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rehab_103_ortho_shoulder ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rehab_103_ortho_shoulder FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rehab_103_ortho_shoulder_t ON tier4_rehab_103_ortho_shoulder;
CREATE POLICY tier4_rehab_103_ortho_shoulder_t ON tier4_rehab_103_ortho_shoulder
  USING (tenant_id = current_setting('app.tenant_id', true));