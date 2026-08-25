-- e481 TIER4_REHAB-105 Neuro
CREATE TABLE IF NOT EXISTS tier4_rehab_105_neuro_rancho (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  current_level NUMERIC NOT NULL,
  description TEXT,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rehab_105_neuro_rancho ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rehab_105_neuro_rancho FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rehab_105_neuro_rancho_t ON tier4_rehab_105_neuro_rancho;
CREATE POLICY tier4_rehab_105_neuro_rancho_t ON tier4_rehab_105_neuro_rancho
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rehab_105_neuro_mobility (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  roll BOOLEAN,
  supine_to_sit BOOLEAN,
  sit_to_stand BOOLEAN,
  transfers BOOLEAN,
  ambulation BOOLEAN,
  stairs BOOLEAN,
  total NUMERIC,
  level TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rehab_105_neuro_mobility ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rehab_105_neuro_mobility FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rehab_105_neuro_mobility_t ON tier4_rehab_105_neuro_mobility;
CREATE POLICY tier4_rehab_105_neuro_mobility_t ON tier4_rehab_105_neuro_mobility
  USING (tenant_id = current_setting('app.tenant_id', true));