-- e508 TIER4_CHRONIC-102 Self-Care
CREATE TABLE IF NOT EXISTS tier4_chronic_102_selfcare_sms (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  self_efficacy NUMERIC NOT NULL,
  knowledge_of_condition NUMERIC NOT NULL,
  skill_use NUMERIC NOT NULL,
  social_support NUMERIC NOT NULL,
  total NUMERIC,
  tier TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_chronic_102_selfcare_sms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_chronic_102_selfcare_sms FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_chronic_102_selfcare_sms_t ON tier4_chronic_102_selfcare_sms;
CREATE POLICY tier4_chronic_102_selfcare_sms_t ON tier4_chronic_102_selfcare_sms
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_chronic_102_selfcare_adherence (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  missed_doses_per_week NUMERIC NOT NULL,
  prescribed_doses_per_week NUMERIC NOT NULL,
  mmas_score NUMERIC NOT NULL,
  adherence_rate NUMERIC,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_chronic_102_selfcare_adherence ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_chronic_102_selfcare_adherence FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_chronic_102_selfcare_adherence_t ON tier4_chronic_102_selfcare_adherence;
CREATE POLICY tier4_chronic_102_selfcare_adherence_t ON tier4_chronic_102_selfcare_adherence
  USING (tenant_id = current_setting('app.tenant_id', true));