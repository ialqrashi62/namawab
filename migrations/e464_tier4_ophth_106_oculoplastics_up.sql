-- e464 TIER4_OPHTH-106 Oculoplastics
CREATE TABLE IF NOT EXISTS tier4_ophth_106_plastics_ptosis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  mr_distance NUMERIC NOT NULL,
  levator_function NUMERIC NOT NULL,
  pupillary_involvement BOOLEAN,
  onset TEXT NOT NULL,
  surgery_indications TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_106_plastics_ptosis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_106_plastics_ptosis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_106_plastics_ptosis_t ON tier4_ophth_106_plastics_ptosis;
CREATE POLICY tier4_ophth_106_plastics_ptosis_t ON tier4_ophth_106_plastics_ptosis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_ophth_106_plastics_laceration (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  involves_margin BOOLEAN,
  involves_lacrimal_system BOOLEAN,
  tissue_loss BOOLEAN,
  levator_laceration BOOLEAN,
  intraocular_fb BOOLEAN,
  mgmt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_106_plastics_laceration ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_106_plastics_laceration FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_106_plastics_laceration_t ON tier4_ophth_106_plastics_laceration;
CREATE POLICY tier4_ophth_106_plastics_laceration_t ON tier4_ophth_106_plastics_laceration
  USING (tenant_id = current_setting('app.tenant_id', true));