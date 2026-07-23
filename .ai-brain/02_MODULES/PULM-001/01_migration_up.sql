-- e106_pulm_module_up.sql
BEGIN;

CREATE TABLE pulm_encounters (
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
CREATE INDEX idx_pulm_enc_tenant ON pulm_encounters(tenant_id, started_at);
ALTER TABLE pulm_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY pulm_enc_tenant ON pulm_encounters
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE pulm_pft (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES pulm_encounters(id) ON DELETE CASCADE,
  test_date TIMESTAMPTZ NOT NULL,
  fev1 NUMERIC(5,2),
  fev1_percent_predicted NUMERIC(5,2),
  fvc NUMERIC(5,2),
  fvc_percent_predicted NUMERIC(5,2),
  fev1_fvc_ratio NUMERIC(4,3),
  tlc NUMERIC(5,2),
  rv NUMERIC(5,2),
  dlco NUMERIC(5,2),
  pattern VARCHAR(30), -- 'OBSTRUCTIVE', 'RESTRICTIVE', 'MIXED', 'NORMAL'
  severity VARCHAR(20), -- 'MILD', 'MODERATE', 'SEVERE', 'VERY_SEVERE'
  bronchodilator_response BOOLEAN DEFAULT FALSE,
  performed_by_user_id BIGINT
);
CREATE INDEX idx_pulm_pft_enc ON pulm_pft(encounter_id);
ALTER TABLE pulm_pft ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_pft FORCE ROW LEVEL SECURITY;
CREATE POLICY pulm_pft_tenant ON pulm_pft
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE pulm_imaging (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES pulm_encounters(id) ON DELETE CASCADE,
  imaging_type VARCHAR(30), -- 'CXR', 'CT_CHEST', 'CTPA', 'HRCT', 'PET', 'BRONCHOSCOPY', 'THORACENTESIS'
  imaging_date TIMESTAMPTZ,
  findings TEXT,
  impression TEXT,
  critical_findings BOOLEAN DEFAULT FALSE,
  performed_by_user_id BIGINT,
  radiologist_user_id BIGINT
);
CREATE INDEX idx_pulm_img_enc ON pulm_imaging(encounter_id);
ALTER TABLE pulm_imaging ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_imaging FORCE ROW LEVEL SECURITY;
CREATE POLICY pulm_img_tenant ON pulm_imaging
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE pulm_medications (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES pulm_encounters(id) ON DELETE CASCADE,
  medication_name VARCHAR(200), -- 'salbutamol', 'tiotropium', 'budesonide', 'fluticasone', 'montelukast', 'theophylline', 'prednisone', 'apixaban'
  dose VARCHAR(50),
  frequency VARCHAR(50),
  route VARCHAR(30), -- 'INH', 'PO', 'IV', 'SC', 'IM'
  indication TEXT,
  is_high_alert BOOLEAN DEFAULT FALSE,
  is_oxygen BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ,
  stopped_at TIMESTAMPTZ,
  prescribed_by_user_id BIGINT
);
CREATE INDEX idx_pulm_meds_enc ON pulm_medications(encounter_id);
ALTER TABLE pulm_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_medications FORCE ROW LEVEL SECURITY;
CREATE POLICY pulm_meds_tenant ON pulm_medications
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE pulm_oxygen_orders (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES pulm_encounters(id) ON DELETE CASCADE,
  order_date TIMESTAMPTZ DEFAULT NOW(),
  delivery_method VARCHAR(30), -- 'NC', 'SIMPLE_MASK', 'NRB', 'HFNC', 'CPAP', 'BIPAP', 'VENTURI'
  flow_rate_l_min NUMERIC(4,1),
  fio2 NUMERIC(4,2),
  target_spo2_low INT,
  target_spo2_high INT,
  titration_plan TEXT,
  ordered_by_user_id BIGINT
);
CREATE INDEX idx_pulm_o2_enc ON pulm_oxygen_orders(encounter_id);
ALTER TABLE pulm_oxygen_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_oxygen_orders FORCE ROW LEVEL SECURITY;
CREATE POLICY pulm_o2_tenant ON pulm_oxygen_orders
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE pulm_procedures (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id BIGINT NOT NULL REFERENCES pulm_encounters(id) ON DELETE CASCADE,
  procedure_name VARCHAR(100), -- 'BRONCHOSCOPY', 'EBUS', 'BAL', 'BIOPSY', 'THORACENTESIS', 'CHEST_TUBE', 'PLEURODESIS', 'TRACHEOSTOMY'
  procedure_date TIMESTAMPTZ,
  indication TEXT,
  findings TEXT,
  complications TEXT,
  pathology TEXT,
  performed_by_user_id BIGINT
);
CREATE INDEX idx_pulm_proc_enc ON pulm_procedures(encounter_id);
ALTER TABLE pulm_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_procedures FORCE ROW LEVEL SECURITY;
CREATE POLICY pulm_proc_tenant ON pulm_procedures
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE pulm_vector_index (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  module_id VARCHAR(20) DEFAULT 'PULM-001',
  index_name VARCHAR(100),
  chunk_id VARCHAR(100),
  chunk_text TEXT,
  embedding VECTOR(768),
  metadata JSONB
);
CREATE INDEX idx_pulm_vector_hnsw ON pulm_vector_index
  USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);
ALTER TABLE pulm_vector_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_vector_index FORCE ROW LEVEL SECURITY;
CREATE POLICY pulm_vector_tenant ON pulm_vector_index
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

COMMIT;
