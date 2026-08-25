-- e255 TIER3_GI-305 GI Bleeding UP
CREATE TABLE IF NOT EXISTS tier3_gi_bleed_events (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  ugib_acuity TEXT,
  gbs_score INTEGER,
  lgib_suspected_etiology TEXT,
  variceal_suspected BOOLEAN DEFAULT false,
  ogib_suspected_source TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_gi_gib_tenant ON tier3_gi_bleed_events(tenant_id);
ALTER TABLE tier3_gi_bleed_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_gi_bleed_events FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_gi_gib_t_tenant_isolation ON tier3_gi_bleed_events;
CREATE POLICY tier3_gi_gib_t_tenant_isolation ON tier3_gi_bleed_events
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));