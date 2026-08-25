-- e510 TIER4_CHRONIC-104 Coordination
CREATE TABLE IF NOT EXISTS tier4_chronic_104_coor_team (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  chronic_conditions TEXT,
  prep_required NUMERIC NOT NULL,
  care_visits_per_year NUMERIC NOT NULL,
  has_caregiver BOOLEAN,
  team TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_chronic_104_coor_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_chronic_104_coor_team FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_chronic_104_coor_team_t ON tier4_chronic_104_coor_team;
CREATE POLICY tier4_chronic_104_coor_team_t ON tier4_chronic_104_coor_team
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_chronic_104_coor_visit (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  care_visits_per_year NUMERIC NOT NULL,
  chronic_conditions TEXT,
  last_visit_days NUMERIC NOT NULL,
  next_visit_months NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_chronic_104_coor_visit ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_chronic_104_coor_visit FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_chronic_104_coor_visit_t ON tier4_chronic_104_coor_visit;
CREATE POLICY tier4_chronic_104_coor_visit_t ON tier4_chronic_104_coor_visit
  USING (tenant_id = current_setting('app.tenant_id', true));