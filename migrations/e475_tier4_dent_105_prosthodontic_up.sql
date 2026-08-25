-- e475 TIER4_DENT-105 Prosthodontic
CREATE TABLE IF NOT EXISTS tier4_dent_105_pros_crown (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  tooth_type TEXT NOT NULL,
  extent TEXT NOT NULL,
  material TEXT NOT NULL,
  occlusion TEXT NOT NULL,
  recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_dent_105_pros_crown ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_dent_105_pros_crown FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_dent_105_pros_crown_t ON tier4_dent_105_pros_crown;
CREATE POLICY tier4_dent_105_pros_crown_t ON tier4_dent_105_pros_crown
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_dent_105_pros_edentulous (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  edentulous_length NUMERIC NOT NULL,
  location TEXT NOT NULL,
  adjacent_teeth_health TEXT NOT NULL,
  bone_quality TEXT NOT NULL,
  option TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_dent_105_pros_edentulous ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_dent_105_pros_edentulous FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_dent_105_pros_edentulous_t ON tier4_dent_105_pros_edentulous;
CREATE POLICY tier4_dent_105_pros_edentulous_t ON tier4_dent_105_pros_edentulous
  USING (tenant_id = current_setting('app.tenant_id', true));