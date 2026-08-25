-- filepath: e711_tier5_ops_ext_105_incident_up.sql
-- TIER5_OPS_EXT-105: Incident reporting tables
CREATE TABLE IF NOT EXISTS incident_report (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  incident_id TEXT NOT NULL,
  category TEXT NOT NULL,
  harm_level TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  description TEXT NOT NULL,
  root_cause TEXT,
  corrective_action TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_incident_t_status ON incident_report(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_incident_t_cat ON incident_report(tenant_id, category);

ALTER TABLE incident_report ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_report FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_incident_t ON incident_report;
CREATE POLICY p_incident_t ON incident_report USING (tenant_id = current_setting('app.tenant_id', true));
