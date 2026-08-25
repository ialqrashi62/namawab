-- filepath: migrations/f017_helpdesk_up.sql
CREATE TABLE IF NOT EXISTS helpdesk_tickets (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL,
  requester varchar(120) NOT NULL,
  severity varchar(8) NOT NULL CHECK (severity IN ('sev1','sev2','sev3')),
  subject varchar(200) NOT NULL,
  queue varchar(24) NOT NULL DEFAULT 'L1_ui' CHECK (queue IN ('L1_ui','L2_api_data','L3_engine_db')),
  status varchar(16) NOT NULL DEFAULT 'open' CHECK (status IN ('open','triaged','resolved')),
  sla_due_minutes int NOT NULL DEFAULT 480,
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_ht_tenant ON helpdesk_tickets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ht_open ON helpdesk_tickets(tenant_id, status, opened_at);
ALTER TABLE helpdesk_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ht_tenant ON helpdesk_tickets;
CREATE POLICY p_ht_tenant ON helpdesk_tickets USING (tenant_id = current_setting('app.tenant_id')::uuid);
