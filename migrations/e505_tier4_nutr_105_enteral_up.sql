-- e505 TIER4_NUTR-105 Enteral
CREATE TABLE IF NOT EXISTS tier4_nutr_105_enteral_route (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  expected_ngt_duration TEXT NOT NULL,
  gastric_empty BOOLEAN,
  aspiration_history BOOLEAN,
  gi_function TEXT NOT NULL,
  route TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_nutr_105_enteral_route ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_nutr_105_enteral_route FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_nutr_105_enteral_route_t ON tier4_nutr_105_enteral_route;
CREATE POLICY tier4_nutr_105_enteral_route_t ON tier4_nutr_105_enteral_route
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_nutr_105_tolerance (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  gastric_residual_ml NUMERIC NOT NULL,
  abdominal_distention BOOLEAN,
  vomiting BOOLEAN,
  diarrhea BOOLEAN,
  action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_nutr_105_tolerance ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_nutr_105_tolerance FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_nutr_105_tolerance_t ON tier4_nutr_105_tolerance;
CREATE POLICY tier4_nutr_105_tolerance_t ON tier4_nutr_105_tolerance
  USING (tenant_id = current_setting('app.tenant_id', true));