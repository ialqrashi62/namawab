-- e370 TIER4_GI-102 Inflammatory Bowel Disease
CREATE TABLE IF NOT EXISTS tier4_gi_102_ibd_diagnosis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  subtype TEXT NOT NULL,
  crp NUMERIC,
  calprotectin NUMERIC,
  endoscopy TEXT,
  activity TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_102_ibd_diagnosis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_102_ibd_diagnosis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_102_ibd_diagnosis_t ON tier4_gi_102_ibd_diagnosis;
CREATE POLICY tier4_gi_102_ibd_diagnosis_t ON tier4_gi_102_ibd_diagnosis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_102_ibd_uc_severity (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  stool_count INT NOT NULL,
  bleeding BOOLEAN,
  mayo_score INT NOT NULL,
  severe BOOLEAN,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_102_ibd_uc_severity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_102_ibd_uc_severity FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_102_ibd_uc_severity_t ON tier4_gi_102_ibd_uc_severity;
CREATE POLICY tier4_gi_102_ibd_uc_severity_t ON tier4_gi_102_ibd_uc_severity
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_102_ibd_therapy (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  subtype TEXT NOT NULL,
  moderate TEXT NOT NULL,
  loss_of_response BOOLEAN,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_102_ibd_therapy ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_102_ibd_therapy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_102_ibd_therapy_t ON tier4_gi_102_ibd_therapy;
CREATE POLICY tier4_gi_102_ibd_therapy_t ON tier4_gi_102_ibd_therapy
  USING (tenant_id = current_setting('app.tenant_id', true));