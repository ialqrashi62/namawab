-- filepath: migrations/e998_integ_up.sql
-- TIER13_INTEG_EXT 101-106 advanced integration tables

CREATE TABLE IF NOT EXISTS tier13_integ_hl7v2 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  message_id TEXT,
  message_type TEXT,
  parse_status TEXT,
  ack_code TEXT,
  ack_status TEXT,
  route_status TEXT,
  dup_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier13_integ_hl7v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier13_integ_hl7v2 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier13_integ_hl7v2_tenant ON tier13_integ_hl7v2;
CREATE POLICY tier13_integ_hl7v2_tenant ON tier13_integ_hl7v2 USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier13_integ_hl7v2_tenant_idx ON tier13_integ_hl7v2 (tenant_id, message_type, created_at DESC);

CREATE TABLE IF NOT EXISTS tier13_integ_fhir_client (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  endpoint_id TEXT,
  resource_type TEXT,
  search_status TEXT,
  read_status TEXT,
  create_status TEXT,
  oauth_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier13_integ_fhir_client ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier13_integ_fhir_client FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier13_integ_fhir_client_tenant ON tier13_integ_fhir_client;
CREATE POLICY tier13_integ_fhir_client_tenant ON tier13_integ_fhir_client USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier13_integ_fhir_client_tenant_idx ON tier13_integ_fhir_client (tenant_id, endpoint_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier13_integ_mirth (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  channel_id TEXT,
  channel_name TEXT,
  channel_status TEXT,
  transform_status TEXT,
  filter_status TEXT,
  deploy_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier13_integ_mirth ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier13_integ_mirth FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier13_integ_mirth_tenant ON tier13_integ_mirth;
CREATE POLICY tier13_integ_mirth_tenant ON tier13_integ_mirth USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier13_integ_mirth_tenant_idx ON tier13_integ_mirth (tenant_id, channel_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier13_integ_webhook (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  subscription_id TEXT,
  event_type TEXT,
  pub_status TEXT,
  recv_status TEXT,
  retry_status TEXT,
  sig_status TEXT,
  sub_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier13_integ_webhook ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier13_integ_webhook FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier13_integ_webhook_tenant ON tier13_integ_webhook;
CREATE POLICY tier13_integ_webhook_tenant ON tier13_integ_webhook USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier13_integ_webhook_tenant_idx ON tier13_integ_webhook (tenant_id, event_type, created_at DESC);

CREATE TABLE IF NOT EXISTS tier13_integ_dicom (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  study_uid TEXT,
  sop_instance_uid TEXT,
  modality TEXT,
  cstore_status TEXT,
  find_status TEXT,
  wado_status TEXT,
  mwl_status TEXT,
  sr_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier13_integ_dicom ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier13_integ_dicom FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier13_integ_dicom_tenant ON tier13_integ_dicom;
CREATE POLICY tier13_integ_dicom_tenant ON tier13_integ_dicom USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier13_integ_dicom_tenant_idx ON tier13_integ_dicom (tenant_id, modality, created_at DESC);

CREATE TABLE IF NOT EXISTS tier13_integ_monitoring (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  endpoint_id TEXT,
  health_status TEXT,
  sla_status TEXT,
  breaker_state TEXT,
  alert_severity TEXT,
  dlq_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier13_integ_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier13_integ_monitoring FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier13_integ_monitoring_tenant ON tier13_integ_monitoring;
CREATE POLICY tier13_integ_monitoring_tenant ON tier13_integ_monitoring USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier13_integ_monitoring_tenant_idx ON tier13_integ_monitoring (tenant_id, health_status, created_at DESC);