-- e212 TIER3_ER-302 Cardiac Arrest / ACLS UP
CREATE TABLE IF NOT EXISTS tier3_er_acls_events (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  patient_id INTEGER,
  rhythm TEXT,
  shockable_rhythm BOOLEAN DEFAULT false,
  ros_achieved BOOLEAN DEFAULT false,
  target_temperature TEXT,
  tachy_interpretation TEXT,
  brady_interpretation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_tier3_er_acls_tenant ON tier3_er_acls_events(tenant_id);
ALTER TABLE tier3_er_acls_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier3_er_acls_events FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier3_er_acls_t_tenant_isolation ON tier3_er_acls_events;
CREATE POLICY tier3_er_acls_t_tenant_isolation ON tier3_er_acls_events
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));