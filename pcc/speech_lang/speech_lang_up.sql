-- speech_lang_up.sql — schema for speech_lang PCC.
CREATE TABLE IF NOT EXISTS speech_lang_admissions (
  id UUID PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_speech_lang_tenant ON speech_lang_admissions(tenant_id);
CREATE TABLE IF NOT EXISTS speech_lang_assessments (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES speech_lang_admissions(id),
  score JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS speech_lang_orders (
  id UUID PRIMARY KEY,
  admission_id UUID NOT NULL REFERENCES speech_lang_admissions(id),
  order_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS speech_lang_audit_log (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  event TEXT NOT NULL,
  prev_hash TEXT,
  entry_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_speech_lang_audit_tenant ON speech_lang_audit_log(tenant_id);
-- Engine functions: AphasiaTypeAssessment, DysarthriaAssessment, DysphagiaFEES, StutteringSeverity, VoiceDisorderGRBAS, AphasiaSeverityAQ, AACNeed, ChildLanguageDisorder, DysphagiaOralCareCognitive, CognitiveCommunicationDisorder
