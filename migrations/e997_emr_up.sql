-- filepath: migrations/e997_emr_up.sql
-- TIER12_EMR_EXT 101-106 advanced EMR tables

CREATE TABLE IF NOT EXISTS tier12_emr_signature (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  document_id TEXT,
  signer_id TEXT,
  signature_type TEXT,
  sig_status TEXT,
  amend_status TEXT,
  attestation_status TEXT,
  audit_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier12_emr_signature ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier12_emr_signature FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier12_emr_signature_tenant ON tier12_emr_signature;
CREATE POLICY tier12_emr_signature_tenant ON tier12_emr_signature USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier12_emr_signature_tenant_idx ON tier12_emr_signature (tenant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier12_emr_template (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  template_id TEXT,
  template_type TEXT,
  completeness TEXT,
  render_status TEXT,
  version TEXT,
  share_scope TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier12_emr_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier12_emr_template FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier12_emr_template_tenant ON tier12_emr_template;
CREATE POLICY tier12_emr_template_tenant ON tier12_emr_template USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier12_emr_template_tenant_idx ON tier12_emr_template (tenant_id, template_type, created_at DESC);

CREATE TABLE IF NOT EXISTS tier12_emr_fhir (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  fhir_resource TEXT,
  fhir_status TEXT,
  bundle_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier12_emr_fhir ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier12_emr_fhir FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier12_emr_fhir_tenant ON tier12_emr_fhir;
CREATE POLICY tier12_emr_fhir_tenant ON tier12_emr_fhir USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier12_emr_fhir_tenant_idx ON tier12_emr_fhir (tenant_id, fhir_resource, created_at DESC);

CREATE TABLE IF NOT EXISTS tier12_emr_voice (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id TEXT,
  transcript_id TEXT,
  engine TEXT,
  consent TEXT,
  capture_status TEXT,
  transcription_status TEXT,
  redact_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier12_emr_voice ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier12_emr_voice FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier12_emr_voice_tenant ON tier12_emr_voice;
CREATE POLICY tier12_emr_voice_tenant ON tier12_emr_voice USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier12_emr_voice_tenant_idx ON tier12_emr_voice (tenant_id, encounter_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier12_emr_cda (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  document_id TEXT,
  template_id TEXT,
  header_status TEXT,
  section_status TEXT,
  valid_status TEXT,
  xds_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier12_emr_cda ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier12_emr_cda FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier12_emr_cda_tenant ON tier12_emr_cda;
CREATE POLICY tier12_emr_cda_tenant ON tier12_emr_cda USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier12_emr_cda_tenant_idx ON tier12_emr_cda (tenant_id, template_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier12_emr_nlp (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  note_id TEXT,
  extract_status TEXT,
  cds_severity TEXT,
  positive_diseases INTEGER,
  facts_preserved_ratio DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier12_emr_nlp ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier12_emr_nlp FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier12_emr_nlp_tenant ON tier12_emr_nlp;
CREATE POLICY tier12_emr_nlp_tenant ON tier12_emr_nlp USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier12_emr_nlp_tenant_idx ON tier12_emr_nlp (tenant_id, created_at DESC);