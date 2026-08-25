-- e144 P0-11 HIS Interoperability UP
-- Tables: hl7_messages, hl7_x12_logs, dicom_studies

CREATE TABLE IF NOT EXISTS hl7_messages (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  msg_id VARCHAR(80) UNIQUE NOT NULL,
  message_type VARCHAR(20),
  raw_message TEXT,
  segments_count INTEGER,
  parsed_json JSONB,
  source_system VARCHAR(50),
  target_system VARCHAR(50),
  direction VARCHAR(10),
  status VARCHAR(20) DEFAULT 'received',
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hl7_msg_tenant ON hl7_messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hl7_msg_type ON hl7_messages(message_type);
ALTER TABLE hl7_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE hl7_messages FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hl7_msg_tenant_isolation ON hl7_messages;
CREATE POLICY hl7_msg_tenant_isolation ON hl7_messages
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS hl7_x12_logs (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  x12_id VARCHAR(80) UNIQUE NOT NULL,
  transaction_set VARCHAR(20),
  member_id VARCHAR(50),
  payer_id VARCHAR(50),
  claim_id VARCHAR(50),
  amount NUMERIC(12,2),
  status VARCHAR(20),
  raw_x12 TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE hl7_x12_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hl7_x12_logs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hl7_x12_tenant_isolation ON hl7_x12_logs;
CREATE POLICY hl7_x12_tenant_isolation ON hl7_x12_logs
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS dicom_studies (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  study_uid VARCHAR(120) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  series_uid VARCHAR(120),
  sop_instance_uid VARCHAR(120),
  sop_class_uid VARCHAR(120),
  modality VARCHAR(10),
  study_date DATE,
  storage_path TEXT,
  transfer_syntax VARCHAR(80),
  uploaded_by INTEGER,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE dicom_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE dicom_studies FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dicom_studies_tenant_isolation ON dicom_studies;
CREATE POLICY dicom_studies_tenant_isolation ON dicom_studies
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));