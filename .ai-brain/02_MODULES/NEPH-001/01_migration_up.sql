-- e108_neph_module_up.sql
BEGIN;

CREATE TABLE neph_encounters (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  encounter_id BIGINT,
  encounter_type VARCHAR(30),
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  primary_diagnosis TEXT,
  ckd_stage VARCHAR(5),
  aki_stage INT,
  egfr NUMERIC(6,2),
  severity_score JSONB,
  disposition VARCHAR(30),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_neph_enc_tenant ON neph_encounters(tenant_id, started_at);
ALTER TABLE neph_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE neph_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY neph_enc_tenant ON neph_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE neph_labs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES neph_encounters(id) ON DELETE CASCADE,
  collected_at TIMESTAMPTZ NOT NULL,
  creatinine NUMERIC(5,2),
  bun NUMERIC(5,1),
  sodium INT,
  potassium NUMERIC(4,1),
  chloride INT,
  bicarbonate INT,
  glucose INT,
  calcium NUMERIC(4,1),
  phosphate NUMERIC(4,1),
  magnesium NUMERIC(3,1),
  egfr NUMERIC(6,2),
  albumin NUMERIC(4,1),
  hemoglobin NUMERIC(5,1)
);
CREATE INDEX idx_neph_labs_enc ON neph_labs(encounter_id, collected_at);
ALTER TABLE neph_labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE neph_labs FORCE ROW LEVEL SECURITY;
CREATE POLICY neph_labs_tenant ON neph_labs
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE neph_dialysis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES neph_encounters(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  dialysis_type VARCHAR(20), -- 'HD', 'HDF', 'PD', 'CRRT', 'SLED', 'UF'
  access_type VARCHAR(20), -- 'AVF', 'AVG', 'TCC', 'CVC', 'PD_catheter'
  access_site VARCHAR(50),
  duration_hours NUMERIC(4,1),
  blood_flow_ml_min INT,
  dialysate_flow_ml_min INT,
  uf_volume_ml INT,
  pre_weight_kg NUMERIC(5,1),
  post_weight_kg NUMERIC(5,1),
  complications TEXT,
  performed_by_user_id BIGINT
);
CREATE INDEX idx_neph_dialysis_enc ON neph_dialysis(encounter_id);
ALTER TABLE neph_dialysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE neph_dialysis FORCE ROW LEVEL SECURITY;
CREATE POLICY neph_dialysis_tenant ON neph_dialysis
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE neph_transplant (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id BIGINT NOT NULL,
  transplant_date TIMESTAMPTZ,
  donor_type VARCHAR(20), -- 'LRD', 'LURD', 'DD'
  hla_match INT,
  crossmatch VARCHAR(20),
  induction_agent VARCHAR(50),
  maintenance_immunosuppression JSONB,
  rejection_episodes INT,
  current_gfr NUMERIC(6,2),
  status VARCHAR(20)
);
CREATE INDEX idx_neph_tx_patient ON neph_transplant(patient_id);
ALTER TABLE neph_transplant ENABLE ROW LEVEL SECURITY;
ALTER TABLE neph_transplant FORCE ROW LEVEL SECURITY;
CREATE POLICY neph_tx_tenant ON neph_transplant
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE neph_medications (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES neph_encounters(id) ON DELETE CASCADE,
  medication_name VARCHAR(200),
  dose VARCHAR(50),
  frequency VARCHAR(50),
  renal_dose_adjustment BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ,
  stopped_at TIMESTAMPTZ,
  prescribed_by_user_id BIGINT
);
CREATE INDEX idx_neph_meds_enc ON neph_medications(encounter_id);
ALTER TABLE neph_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE neph_medals_meds ENABLE ROW LEVEL SECURITY;
CREATE POLICY neph_meds_tenant ON neph_medications
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE neph_vector_index (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  module_id VARCHAR(20) DEFAULT 'NEPH-001',
  index_name VARCHAR(100),
  chunk_id VARCHAR(100),
  chunk_text TEXT,
  embedding VECTOR(768),
  metadata JSONB
);
CREATE INDEX idx_neph_vector_hnsw ON neph_vector_index
  USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);
ALTER TABLE neph_vector_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE neph_vector_index FORCE ROW LEVEL SECURITY;
CREATE POLICY neph_vector_tenant ON neph_vector_index
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

COMMIT;
