-- e477 TIER4_REHAB-101 Stroke
CREATE TABLE IF NOT EXISTS tier4_rehab_101_stroke_berg (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  sitting_balance NUMERIC NOT NULL,
  standing_balance NUMERIC NOT NULL,
  transfers NUMERIC NOT NULL,
  reaching NUMERIC NOT NULL,
  turning NUMERIC NOT NULL,
  total NUMERIC,
  risk TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rehab_101_stroke_berg ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rehab_101_stroke_berg FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rehab_101_stroke_berg_t ON tier4_rehab_101_stroke_berg;
CREATE POLICY tier4_rehab_101_stroke_berg_t ON tier4_rehab_101_stroke_berg
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rehab_101_stroke_recovery (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  days_since_stroke NUMERIC NOT NULL,
  nihss NUMERIC NOT NULL,
  motor_deficit BOOLEAN,
  dysarthria BOOLEAN,
  fime_phase TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rehab_101_stroke_recovery ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rehab_101_stroke_recovery FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rehab_101_stroke_recovery_t ON tier4_rehab_101_stroke_recovery;
CREATE POLICY tier4_rehab_101_stroke_recovery_t ON tier4_rehab_101_stroke_recovery
  USING (tenant_id = current_setting('app.tenant_id', true));