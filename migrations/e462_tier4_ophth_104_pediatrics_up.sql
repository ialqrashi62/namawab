-- e462 TIER4_OPHTH-104 Pediatrics
CREATE TABLE IF NOT EXISTS tier4_ophth_104_ped_amblyopia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  amblyogenic_factor TEXT NOT NULL,
  visual_acuity_severity TEXT NOT NULL,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_104_ped_amblyopia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_104_ped_amblyopia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_104_ped_amblyopia_t ON tier4_ophth_104_ped_amblyopia;
CREATE POLICY tier4_ophth_104_ped_amblyopia_t ON tier4_ophth_104_ped_amblyopia
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_ophth_104_ped_redreflex (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  red_reflex_present BOOLEAN,
  leukocoria BOOLEAN,
  blurry_corneal_reflex BOOLEAN,
  action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_104_ped_redreflex ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_104_ped_redreflex FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_104_ped_redreflex_t ON tier4_ophth_104_ped_redreflex;
CREATE POLICY tier4_ophth_104_ped_redreflex_t ON tier4_ophth_104_ped_redreflex
  USING (tenant_id = current_setting('app.tenant_id', true));