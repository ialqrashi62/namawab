-- e214 TIER3_ER-304 Mass Casualty / Disaster UP
CREATE TABLE IF NOT EXISTS tier3_er_disaster_events (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  triage_category TEXT,
  mci_classification TEXT,
  surge_level TEXT,
  decon_strategy TEXT,
  communication_status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_er_disas_tenant ON tier3_er_disaster_events(tenant_id);
ALTER TABLE tier3_er_disaster_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_er_disaster_events FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_er_disas_t_tenant_isolation ON tier3_er_disaster_events;
CREATE POLICY tier3_er_disas_t_tenant_isolation ON tier3_er_disaster_events
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));