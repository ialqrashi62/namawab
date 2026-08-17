-- migrations/e999-g080_ai_brain_ext.sql
-- TIER60 AI Brain Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS ai_clin_dec_logs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  model TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ai_clin_dec_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_clin_dec_logs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_clin_dec_logs_t ON ai_clin_dec_logs;
CREATE POLICY ai_clin_dec_logs_t ON ai_clin_dec_logs USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ai_diag_img_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  modality TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ai_diag_img_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_diag_img_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_diag_img_records_t ON ai_diag_img_records;
CREATE POLICY ai_diag_img_records_t ON ai_diag_img_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ai_nlp_doc_outputs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  doc_type TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ai_nlp_doc_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_nlp_doc_outputs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_nlp_doc_outputs_t ON ai_nlp_doc_outputs;
CREATE POLICY ai_nlp_doc_outputs_t ON ai_nlp_doc_outputs USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ai_forecast_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  forecast_type TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ai_forecast_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_forecast_results FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_forecast_results_t ON ai_forecast_results;
CREATE POLICY ai_forecast_results_t ON ai_forecast_results USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ai_chatbot_sessions (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  session_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ai_chatbot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chatbot_sessions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ai_chatbot_sessions_t ON ai_chatbot_sessions;
CREATE POLICY ai_chatbot_sessions_t ON ai_chatbot_sessions USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
