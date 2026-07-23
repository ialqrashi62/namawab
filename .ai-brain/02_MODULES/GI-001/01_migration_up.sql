-- e107_gi_module_up.sql
BEGIN;

CREATE TABLE gi_encounters (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  encounter_id BIGINT,
  encounter_type VARCHAR(30),
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  primary_diagnosis TEXT,
  severity_score JSONB,
  disposition VARCHAR(30),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_gi_enc_tenant ON gi_encounters(tenant_id, started_at);
ALTER TABLE gi_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY gi_enc_tenant ON gi_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE gi_endoscopies (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES gi_encounters(id) ON DELETE CASCADE,
  procedure_type VARCHAR(30), -- 'EGD', 'COLONOSCOPY', 'ERCP', 'EUS', 'SIGMOIDOSCOPY', 'ENTEROSCOPY', 'CAPSULE'
  procedure_date TIMESTAMPTZ,
  indication TEXT,
  findings TEXT,
  interventions JSONB, -- ['biopsy', 'polypectomy', 'band_ligation', 'clip', 'injection']
  complications TEXT,
  bowel_prep_quality VARCHAR(20), -- 'EXCELLENT', 'GOOD', 'FAIR', 'POOR' (for colonoscopy)
  performed_by_user_id BIGINT,
  pathology TEXT
);
CREATE INDEX idx_gi_endo_enc ON gi_endoscopies(encounter_id);
ALTER TABLE gi_endoscopies ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_endoscopies FORCE ROW LEVEL SECURITY;
CREATE POLICY gi_endo_tenant ON gi_endoscopies
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE gi_medications (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES gi_encounters(id) ON DELETE CASCADE,
  medication_name VARCHAR(200),
  dose VARCHAR(50),
  frequency VARCHAR(50),
  route VARCHAR(30),
  indication TEXT,
  is_high_alert BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ,
  stopped_at TIMESTAMPTZ,
  prescribed_by_user_id BIGINT
);
CREATE INDEX idx_gi_meds_enc ON gi_medications(encounter_id);
ALTER TABLE gi_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_medications FORCE ROW LEVEL SECURITY;
CREATE POLICY gi_meds_tenant ON gi_medications
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE gi_liver (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES gi_encounters(id) ON DELETE CASCADE,
  child_pugh_score INT,
  child_pugh_class VARCHAR(5), -- 'A', 'B', 'C'
  meld_score INT,
  meld_na_score INT,
  bilirubin NUMERIC(4,1),
  albumin NUMERIC(4,1),
  inr NUMERIC(4,1),
  sodium INT,
  creatinine NUMERIC(4,1),
  ascites BOOLEAN DEFAULT FALSE,
  encephalopathy BOOLEAN DEFAULT FALSE,
  varices_present BOOLEAN DEFAULT FALSE,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_gi_liver_enc ON gi_liver(encounter_id);
ALTER TABLE gi_liver ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_liver FORCE ROW LEVEL SECURITY;
CREATE POLICY gi_liver_tenant ON gi_liver
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE gi_bleed_assessments (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES gi_encounters(id) ON DELETE CASCADE,
  assessment_type VARCHAR(20), -- 'UPPER', 'LOWER', 'OBSCURE'
  gbs_score INT, -- Glasgow-Blatchford
  aims65_score INT,
  hemoglobin NUMERIC(5,1),
  heart_rate INT,
  systolic_bp INT,
  melena BOOLEAN,
  hematemesis BOOLEAN,
  hematochezia BOOLEAN,
  syncope BOOLEAN,
  hepatic_disease BOOLEAN,
  cardiac_failure BOOLEAN,
  assessed_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_gi_bleed_enc ON gi_bleed_assessments(encounter_id);
ALTER TABLE gi_bleed_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_bleed_assessments FORCE ROW LEVEL SECURITY;
CREATE POLICY gi_bleed_tenant ON gi_bleed_assessments
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE gi_vector_index (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  module_id VARCHAR(20) DEFAULT 'GI-001',
  index_name VARCHAR(100),
  chunk_id VARCHAR(100),
  chunk_text TEXT,
  embedding VECTOR(768),
  metadata JSONB
);
CREATE INDEX idx_gi_vector_hnsw ON gi_vector_index
  USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);
ALTER TABLE gi_vector_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_vector_index FORCE ROW LEVEL SECURITY;
CREATE POLICY gi_vector_tenant ON gi_vector_index
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

COMMIT;
