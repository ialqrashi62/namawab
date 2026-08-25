-- e480 TIER4_REHAB-104 Speech
CREATE TABLE IF NOT EXISTS tier4_rehab_104_speech_dysphagia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  oral_phase_impaired BOOLEAN,
  pharyngeal_phase_impaired BOOLEAN,
  aspiration_signs BOOLEAN,
  weight_loss BOOLEAN,
  pneumonia_history BOOLEAN,
  severity_score NUMERIC,
  risk TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rehab_104_speech_dysphagia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rehab_104_speech_dysphagia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rehab_104_speech_dysphagia_t ON tier4_rehab_104_speech_dysphagia;
CREATE POLICY tier4_rehab_104_speech_dysphagia_t ON tier4_rehab_104_speech_dysphagia
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_rehab_104_speech_aphasia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  fluency TEXT NOT NULL,
  comprehension TEXT NOT NULL,
  repetition TEXT NOT NULL,
  type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_rehab_104_speech_aphasia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_rehab_104_speech_aphasia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_rehab_104_speech_aphasia_t ON tier4_rehab_104_speech_aphasia;
CREATE POLICY tier4_rehab_104_speech_aphasia_t ON tier4_rehab_104_speech_aphasia
  USING (tenant_id = current_setting('app.tenant_id', true));