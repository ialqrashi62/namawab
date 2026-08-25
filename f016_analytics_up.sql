-- f016_analytics_up.sql — analytics_events table with multi-tenant RLS
CREATE TABLE IF NOT EXISTS analytics_events (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL,
  user_role varchar(32),
  event varchar(48) NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ae_tenant ON analytics_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ae_event ON analytics_events(tenant_id, event, created_at);
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ae_tenant ON analytics_events;
CREATE POLICY p_ae_tenant ON analytics_events
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
