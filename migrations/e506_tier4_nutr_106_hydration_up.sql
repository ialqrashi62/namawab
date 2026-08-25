-- e506 TIER4_NUTR-106 Hydration + Electrolytes
CREATE TABLE IF NOT EXISTS tier4_nutr_106_hydration (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  weight_kg NUMERIC NOT NULL,
  activity_level TEXT NOT NULL,
  climate TEXT NOT NULL,
  fever BOOLEAN,
  total_ml NUMERIC,
  therapy TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_nutr_106_hydration ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_nutr_106_hydration FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_nutr_106_hydration_t ON tier4_nutr_106_hydration;
CREATE POLICY tier4_nutr_106_hydration_t ON tier4_nutr_106_hydration
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_nutr_106_electrolyte (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  sodium NUMERIC NOT NULL,
  potassium NUMERIC NOT NULL,
  chloride NUMERIC NOT NULL,
  bicarbonate NUMERIC NOT NULL,
  diagnosis TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_nutr_106_electrolyte ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_nutr_106_electrolyte FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_nutr_106_electrolyte_t ON tier4_nutr_106_electrolyte;
CREATE POLICY tier4_nutr_106_electrolyte_t ON tier4_nutr_106_electrolyte
  USING (tenant_id = current_setting('app.tenant_id', true));