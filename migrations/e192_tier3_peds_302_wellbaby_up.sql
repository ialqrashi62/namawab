-- e192 TIER3_PEDS-302 Well-Baby UP
CREATE TABLE IF NOT EXISTS tier3_peds_wellbaby_visits (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  age_months INTEGER,
  weight_zscore NUMERIC(5,2),
  height_zscore NUMERIC(5,2),
  growth_flag TEXT,
  vaccinations_due TEXT,
  breastfeeding_status TEXT,
  development_status TEXT,
  parent_guidance TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_peds_wellbaby_tenant ON tier3_peds_wellbaby_visits(tenant_id);
ALTER TABLE tier3_peds_wellbaby_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_peds_wellbaby_visits FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_peds_wellbaby_t_tenant_isolation ON tier3_peds_wellbaby_visits;
CREATE POLICY tier3_peds_wellbaby_t_tenant_isolation ON tier3_peds_wellbaby_visits
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));